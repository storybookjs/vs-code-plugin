import * as vscode from 'vscode';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as ps from 'ps-node';
import * as child_process from 'child_process';
import * as events from 'events';
import * as os from 'os';

/* ALTERNATE APPROACH W/O PS-NODE LIBRARY

	export async function isProcessRunning(processName: string): Promise<boolean> {
	const cmd = (() => {
		switch (process.platform) {
			case 'win32': return `tasklist`
			case 'darwin': return `ps -ax | grep ${processName}`
			case 'linux': return `ps -A`
			default: return false
		}
	})()

	return new Promise((resolve, reject) => {
		require('child_process').exec(cmd, (err: Error, stdout: string, stderr: string) => {
			if (err) reject(err)

			resolve(stdout.toLowerCase().indexOf(processName.toLowerCase()) > -1)
		})
	})
	}
	const running: boolean = await isProcessRunning('myProcess')
*/

/* CLASSES:
class aesopWebviewOptions implements vscode.WebviewOptions{
	constructor(PORT){
		this.portMapping[0].webviewPort = PORT;
		this.portMapping[0].extensionHostPort = PORT;
	}
	enableCommandUris: boolean = true;
	enableScripts: boolean = true;
	portMapping: [{
		webviewPort: any,
		extensionHostPort: any
	}];
	// localResourceRoots: vscode.Uri[] = [vscode.Uri.file(context.extensionPath)]
};

class panel implements vscode.WebviewPanel {
	constructor(html : string){
		this.webview.html = html;
	}
	viewType: 'aesop-sb';
	title: 'Aesop';
	webview: aesopWebview;
	options: {
		enableFindWidget: false,
		retainContextWhenHidden: true
	};
	viewColumn: vscode.ViewColumn.Beside;
	active: true;
	visible: true;
	dispose(){
		//write logic in here to keep Storybook running
	};
	//we are not messaging right now but we will to preserve state
	onDidChangeViewState() {
		return null;
	};
	onDidDispose(dispose){
		return dispose;
	};
	reveal() {};
};

class aesopWebview implements vscode.Webview {
	constructor(html : string) {
		this.html = html;
	}
	cspSource: string = 'http';
	html: string;
	options: aesopWebviewOptions;

	//these are required properties, but we are not yet using messaging
	asWebviewUri( localResource: vscode.Uri){
		return localResource;
	};
	onDidReceiveMessage(){
		return null;
	};
	postMessage() {
		return null;
	};
}
*/

/* TEMPLATE HTML
	let templateHTML = `
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Aesop</title>
			<style>
				html { width: 100%; height: 100%; min-width: 20%; min-height: 20%;}
				body { display: flex; flex-flow: column nowrap; padding: 0; margin: 0; width: 100%' justify-content: center}
			</style>
		</head>
		<body>
			<script>
				const vscode = acquireVsCodeApi();
				const oldState = vscode.getState() || { value: 0 };
			</script>
			<iframe src="http://${host}:${PORT}" width="100%" height="700"></iframe>
		</body>
	</html>`;
*/



export function activate(context: vscode.ExtensionContext) {

	//define PORT and host variables to feed the webview content from SB server
	let PORT : number;
	let host : string = 'localhost';
	const aesopEmitter = new events.EventEmitter();

	const platform = os.platform();
	const commands = {
		linux: {
			cmd: 'netstat',
			args: ['-apntu'],
		},
		darwin: {
			cmd: 'netstat',
			args: ['-v', '-n', '-p', 'tcp'],
		},
		win32: {
			cmd: 'netstat.exe',
			args: ['-a', '-n', '-o'],
		},
	};
		
	const command = commands[platform];
//@TODO: if aesop already opened sb in webview - subsequent calls to aesop should not open a new webview

	//set context "aesop-awake" to true; enabling views
	vscode.commands.executeCommand("setContext", "aesop-awake", true);

	//create the status bar to let the user know what Aesop is doing
	const statusText = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 7);
	statusText.text = "Aesop is finding your Storybook dependency..."
	statusText.color = "#FFFFFF";
	statusText.command = undefined;
	statusText.tooltip = "Aesop status";
	
	//create disposable to register Aesop Awaken command to subscriptions
	let disposable : vscode.Disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {
		statusText.show();

		//declare variable to toggle whether running Node processes have been checked
		let checkedProcesses : Boolean = false;

		//declare variable to toggle whether a running SB process was found
		let foundSb : Boolean = false;

		//define a path to the user's root working directory
		const rootDir = fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));

		//first test whether Storybook has been depended into your application
		fs.access(path.join(rootDir, '/node_modules/@storybook'), (err) => {

			//if the filepath isn't found, show the user what Aesop is reading as the root path
			if (err) {
				vscode.window.showErrorMessage(`Aesop could not find Storybook as a dependency in the active folder, ${rootDir}`);
				throw new Error('Error finding a storybook project')
			}	else {
				statusText.text = "`Aesop found Storybook dependency"

				//check to see if a storybook node process is already running
					ps.lookup (
						{command: 'node',
						psargs: 'ux'
					}, (err : Error, resultList : any) => {
						if (err){
							vscode.window.showErrorMessage(`Failed looking for running Node processes. Error: ${err}`);
							statusText.dispose();
							throw new Error('no node process found');
							
						} else {
							//notify the user that Aesop is checking for a running Storybook instances
							statusText.text = `Reviewing Node processes...`;

							//if the process lookup was able to find running processes, iterate through to review them
							resultList.forEach((process) => {
		
								//check if any running processes are Storybook processes
								//stretch feature: check for multiple instances of storybook and reconcile

								if(process.arguments[0].includes('storybook')){

									//if so, extract port number and use that value to populate the webview with that contents
									const pFlagIndex = process.arguments.indexOf('-p');

									//also grab the process id to use netstat in the else condition
									const processPid = parseInt(process['pid']).toString();

									//if a port flag has been defined in the process args, retrieve the user's config
									if (pFlagIndex !== -1){
										PORT = parseInt(process.arguments[pFlagIndex+1]);
										aesopEmitter.emit('sb_on')
									} else {
										//if no port flag defined, dynamically retrieve port with netstat
										const netStatProcess = child_process.spawn(command.cmd, command.args);
										const grepProcess = child_process.spawn('grep', [processPid]);

										netStatProcess.stdout.pipe(grepProcess.stdin);
										grepProcess.stdout.setEncoding('utf8');
										grepProcess.stdout.on('data', (data) => {
											const parts = data.split(/\s/).filter(String);
											//@TODO: refactor for platform specific or grab port dynamically
											const partIndex = (platform === 'win32') ? 2 : 3;
											PORT = parseInt(parts[partIndex].replace(/[^0-9]/g, ''));
											aesopEmitter.emit('sb_on');
										})
										
										netStatProcess.stdout.on('exit', (code) =>{
											vscode.window.showInformationMessage(`Netstat ended with ${code}`);
										})
										
										grepProcess.stdout.on('exit', (code) =>{
											vscode.window.showInformationMessage(`Grep ended with ${code}`);
										})
										

									}
									//set foundSb to true to prevent our function from running another process
									foundSb = true;
									
									//once port is known, fire event emitter to instantiate webview
									statusText.text = `Retrieving running Storybook process...`;

								}//---> close if process.arguments[0] contains storybook
							}) //---> close resultList.forEach()

							//having checked running Node processes, set that variable to true
						
							//if no processes matched 'storybook', we will have to spin up the storybook server
							if (foundSb === false){
								
								//starts by checking for/extracting any port flags from the SB script in the package.json
								fs.readFile(path.join(rootDir, 'package.json'), (err, data) => {
									if (err){
										vscode.window.showErrorMessage(`Aesop is attempting to read ${rootDir}. Is there a package.json file here?`);
										statusText.dispose();
									}	else {
										statusText.text = `Checking package.json...`;

										//enter the package.JSON file and retrieve its contents as an object
										let packageJSON = JSON.parse(data.toString());
										let storybookScript = packageJSON.scripts.storybook;
										
										//iterate through the text string (stored on "storybook" key) and parse out port flag
										//it is more helpful to split it into an array separated by whitespace to grab this
										let retrievedScriptArray = storybookScript.split(' ');
										
										//@TODO if script already includes --ci, no need to add it

										//older Windows systems support here: check platform, change process command accordingly
										let platform : NodeJS.Platform = os.platform();
										vscode.window.showInformationMessage(`Your platform is ${platform}`);
										
										const sbCLI = './node_modules/.bin/start-storybook'
										const sbStartIndex = retrievedScriptArray.indexOf('start-storybook')
										retrievedScriptArray[sbStartIndex] = sbCLI;
										retrievedScriptArray.push('--ci')

										//now launch the child process on the port you've derived
										const runSb = child_process.spawn('node',retrievedScriptArray, {cwd: rootDir, detached: false, env: process.env, windowsHide: false, windowsVerbatimArguments: true });

										statusText.text = `Done looking. Aesop will now launch Storybook in the background.`;

										runSb.stdout.setEncoding('utf8');

										let counter = 0;

										//Storybook outputs three messages to the terminal as it spins up
										//grab the port from the last message to listen in on the process

										runSb.stdout.on('data', (data) => {
											let str = data.toString();
											let lines = str.split(" ");
											//vscode.window.showInformationMessage(`lines: ${lines}`);
											counter += 1;
											if (counter >= 2) {
												for (let i = 165; i < lines.length; i += 1){
													if(lines[i].includes('localhost')) {
					
														const path = lines[i];
														const regExp = (/[^0-9]/g);
														PORT = (path.replace(regExp, ""));
														vscode.window.showInformationMessage(`Storybook is now running on localhost:${PORT}`);
														aesopEmitter.emit('sb_on')
														break;
													}
												}
											}
										})

										runSb.on('error', (err) => {
											console.log(err);
											process.exit(1);
										})

										//make sure the child process is terminated on process exit
										runSb.on('close', (code) => {
											console.log(`child process exited with code ${code}`);
										})
									}
								})
							} //close spin up server
						}; //CLOSE else psLookup
					}); //close ps LOOKUP //close depend found, not checked processes
			}//close else statement in fs.access
		}) //close fs access

		aesopEmitter.on('sb_on', () => {
			createAesop(PORT, host);
		});
	
		function createAesop(PORT, host){
			statusText.hide();
		
			vscode.window.showInformationMessage(`Welcome to Aesop Storybook`);
			const panel = vscode.window.createWebviewPanel(
				'aesop-sb',
				'Aesop',
				vscode.ViewColumn.Beside,
				{
					enableCommandUris: true,
					enableScripts: true,
					portMapping: [{
						webviewPort: PORT,
						extensionHostPort: PORT
					}],
					localResourceRoots: [vscode.Uri.file(context.extensionPath)],
				}
			);
	
			panel.webview.html = `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Aesop</title>
					<style>
						html { width: 100%; height: 100%; min-width: 20%; min-height: 20%;}
						body { display: flex; flex-flow: column nowrap; padding: 0; margin: 0; width: 100%' justify-content: center}
					</style>
				</head>
				<body>
					<iframe src="http://${host}:${PORT}" width="100%" height="600"></iframe>
					<p>Counter = 2</p>
				</body>
			</html>`
		} // close createAesop helper function

	}); //close disposable

	context.subscriptions.push(disposable);
}

	

export function deactivate() {

}