import * as vscode from 'vscode';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as ps from 'ps-node';
import * as child_process from 'child_process';
import * as events from 'events';
import * as os from 'os';

const aesopEmitter = new events.EventEmitter();

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

export function activate(context: vscode.ExtensionContext) {

	let PORT : number = vscode.workspace.getConfiguration("aesop").get("port");
	let host : string = vscode.workspace.getConfiguration("aesop").get("host");
	vscode.window.showInformationMessage(`Port set by default to ${PORT}`);

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
			}	else {
				statusText.show();

				//check to see if a storybook node process is already running
				if (checkedProcesses === false){
					ps.lookup(
						{command: 'node',
						psargs: 'ux'
					}, (err : Error, resultList : any) => {
						if (err){
							vscode.window.showErrorMessage(`Failed looking for running Node processes. Error: ${err}`);
							statusText.dispose();
						} else {
							//notify the user that Aesop is checking for a running Storybook instance
							statusText.text = `Reviewing Node processes...`;

							//if the process lookup was able to find running processes, iterate through to review them
							resultList.forEach((process) => {

								/* OUTPUT LOGGER */
								fs.writeFile(path.join(rootDir, 'YOLO.txt'), `Attempted launch log:\n`,
								(err) => {console.log(`Couldn't output process information to YOLO.txt: ${err}`)});
		
								//check if any running processes are Storybook processes
								if(process.arguments[0].includes('storybook')){

									//stretch goal: check for multiple instances of storybook and reconcile
									//if so, extract port number and use that value to populate the webview with that contents
									const pFlagIndex = process.arguments.indexOf('-p');
									if (pFlagIndex !== -1){
										PORT = parseInt(process.arguments[pFlagIndex+1]);
									}
									
									//set foundSb to true to prevent our function from running another process
									foundSb = true;
									statusText.text = `Retrieving running Storybook process...`;
									//the Aesop event emitter will now create the webview function 
									aesopEmitter.emit('sb_on');
									statusText.hide();

									/* OUTPUT LOGGER */
									fs.appendFile(path.join(rootDir, 'YOLO.txt'), `This process matches for 'storybook':\n
									PID: ${process.pid}, COMMAND:${process.command}, ARGUMENTS: ${process.arguments}\n
									PORT has been assigned to: ${PORT}`, (err) => {console.log(err)});

								}//---> close if process.arguments[0] contains storybook
							}) //---> close resultList.forEach()

							//having checked running Node processes, set that variable to true
							checkedProcesses = true;
						
							//if no processes matched 'storybook', we will have to spin up the storybook server
							if (checkedProcesses === true && foundSb === false){
								
								//starts by checking for/extracting any port flages from the SB script in the package.json
								fs.readFile(path.join(rootDir, 'package.json'), (err, data) => {
									if (err){
										vscode.window.showErrorMessage(`Aesop is attempting to read ${rootDir}. Is there a package.json file here?`);
										statusText.dispose();
									}	else {
										statusText.text = `Checking package.json...`;
										statusText.show();

										//enter the package.JSON file and retrieve its contents as an object
										let packageJSON = JSON.parse(data.toString());
										let storybookScript = packageJSON.scripts.storybook;
					
										/* OUTPUT LOGGER */
										fs.appendFile(path.join(rootDir, 'YOLO.txt'), `Here is the script for "storybook":\n
										${storybookScript}`, (err) => {console.log(err)});
										
										//iterate through the text string (stored on "storybook" key) and parse out port flag
										//it is more helpful to split it into an array separated by whitespace to grab this
										let retrievedScriptArray = storybookScript.split(' ');
										
										for (let i = 0; i < retrievedScriptArray.length; i++){
											//stretch goal: add logic for other flags as we implement further functionality
											if (retrievedScriptArray[i] === '-p'){
												PORT = parseInt(retrievedScriptArray[i+1]);

												/* OUTPUT LOGGER */
												fs.appendFile(path.join(rootDir, 'YOLO.txt'), `Port from script":\n${parseInt(retrievedScriptArray[i+1])}\n
												Port at this moment:\n${PORT}\n`, (err) => {console.log(err)});
											} else if (i === retrievedScriptArray.length-1){
												//termination case: when you have reached the end of the script in the 'for' loop
												//ADD LOGIC TO HANDLE WHEN NO SCRIPT FLAG IS GIVEN

												/* OUTPUT LOGGER */
												fs.appendFile(path.join(rootDir, 'YOLO.txt'), `Script found, but no port flag detected.\n
												Port when no port flag found:\n${PORT}\n`, (err) => {console.log(err)});
											}
										};

										//possible: add --ci tag to existing package.json with an fs function?
										//e.g. process.scripts.storybook = `${storybookScript} --ci`, then write

										//older Windows systems support here: check platform, change process command accordingly
										let platform : NodeJS.Platform = os.platform();
										vscode.window.showInformationMessage(`Your platform is ${platform}`);
										let processCommand : string;

										switch (platform) {
											case 'win32':
											 processCommand = 'npm.cmd';
											 vscode.window.showInformationMessage(`${processCommand}`);
											break;
											default:
												processCommand = 'npm';
										}

										vscode.window.showWarningMessage(`${process.cwd()}`)
										vscode.window.showInformationMessage(`${rootDir}`);

										//now launch the child process on the port you've derived
										const runSb = child_process.spawn(processCommand, ['run', 'storybook'], {cwd: rootDir, detached: true, env: process.env, windowsHide: false, windowsVerbatimArguments: true });

										statusText.text = `Done looking. Aesop will now run Storybook.`;

										runSb.stdout.setEncoding('utf8');

										let counter = 0;

										runSb.stdout.on('data', (data) => {
											let str = data.toString();
											let lines = str.split(" ");
											counter += 1;
											if (counter === 3) {
												for (let i = 165; i < lines.length; i += 1){
													if(lines[i].includes('localhost')) {
					
														const path = lines[i];
														const regExp = (/[^0-9]/g);
														PORT = (path.replace(regExp, ""));
														vscode.window.showInformationMessage(`This is port: ${PORT}`);
														break;
													}
												}

											let sbPortFlag = '-p';
											  if (lines.includes(sbPortFlag)){
											    const indexOfP = lines.indexOf(sbPortFlag);
											    vscode.window.showInformationMessage(`This is indexOfP: `, indexOfP);
											    if(indexOfP !== -1) {
											      PORT = parseInt(lines[indexOfP + 1]);
														vscode.window.showInformationMessage(`storybook is now running on port: ${PORT}`);
														aesopEmitter.emit('sb_on');
														statusText.hide();
											    }
												}
											}
										})

										runSb.on('error', (err) => {
											console.log(err);
											process.exit(1);
										})

										//This will make sure the child process is terminated on process exit
										runSb.on('close', (code) => {
											console.log(`child process exited with code ${code}`);
										})
									}
								})
							} //close spin up server
						}; //CLOSE else psLookup
					}); //close ps LOOKUP
				} //close depend found, not checked processes
			}//close else statement in fs.access
		}) //close fs access
	}); //close disposable

	context.subscriptions.push(disposable);

	aesopEmitter.on('sb_on', () => {
		vscode.commands.executeCommand('extension.aesopChronicle');
	});

	let openDisposable : vscode.Disposable = vscode.commands.registerCommand('extension.aesopChronicle', () => {
		statusText.hide();
	
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
			//RETURN HERE AND TROUBLESHOOT WebviewOptions object to overwrite html
		);

		panel.webview.html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Aesop</title>
			</head>
			<body>
				<iframe src="http://${host}:${PORT}/></iframe>
			</body>
		</html>`

		// const aesopWebview : vscode.Webview = {
		// 	cspSource: null,
		// 	html: aesopPreviewHTML,
		// 	options: {
		// 		enableCommandUris: true,
		// 		enableScripts: true,
		// 		portMapping: [{
		// 			webviewPort: PORT,
		// 			extensionHostPort: PORT,
		// 		}],
		// 		localResourceRoots: [vscode.Uri.file(context.extensionPath)]
		// 	},
		// 	asWebviewUri(){};
		// 	onDidReceiveMessage(){};
		// 	postMessage() {}
		// }

		// const panel : vscode.WebviewPanel = {
		// 	viewType: 'aesop-sb',
		// 	active: true,
		// 	options: {
		// 		enableFindWidget: false,
		// 		retainContextWhenHidden: true
		// 	},
		// 	title: 'Aesop',
		// 	viewColumn: vscode.ViewColumn.Beside,
		// 	visible: true,
		// 	webview: aesopWebview,

		// 	dispose(){},
		// 	onDidChangeViewState() : vscode.Event<vscode.WebviewPanelOnDidChangeViewStateEvent>{},
		// 	onDidDispose(){},
		// 	reveal() {},
		// }
	
		//here's where I need logic to fill html
		// const aesopPreviewHTML : string = `
		
	});

	context.subscriptions.push(openDisposable);
}

export function deactivate() {
}