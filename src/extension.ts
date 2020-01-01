import * as vscode from 'vscode';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as ps from 'ps-node';

let PORT = 6006;
const host = 'localhost';

// import * as express from 'express';
// import { resolveCliPathFromVSCodeExecutablePath } from 'vscode-test';
// const server = express();

export function activate(context: vscode.ExtensionContext) {
	// server.get('/', (req, res) => {
	// 	vscode.window.showInformationMessage('Aesop server online');
	// 	res.end();
	// });
	// server.listen(PORT);

  //create disposable variable type, registers awaken command & opens webview
	let disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {

		//define a path to the root working directory of the user
		const rootDir = fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));

		//check first to ensure that Storybook has been depended into the current working directory
		fs.access(path.join(rootDir, '/node_modules/@storybook'), (err) => {
			//if the filepath isn't found, show the user what Aesop is reading as the root path
			if (err) {
				vscode.window.showErrorMessage(`Aesop could not find Storybook as a dependency in the active folder, ${rootDir}`);
			}	else {
				//check to see if a storybook node process is already running
				ps.lookup({
					command: 'node',
					psargs: 'ux'
				}, (err, resultList) => {
					if (err){
						vscode.window.showErrorMessage(`Failed looking for running Node processes. Error: ${err}`);
					} else {
						//if the process lookup was able to find running processes, iterate through to review them
						//potential problem: we may also need to account for running processes given no port flag
						resultList.forEach((process) => {

							// ---> OUTPUT LOGGER <--- //
							fs.writeFile(path.join(rootDir, 'YOLO.txt'),
							`Here is the JSON-stringified version of a process:\n${JSON.stringify(process)}\n`,
							(err) => {console.log(`Couldn't output process information to YOLO.txt: ${err}`)});
							vscode.window.showInformationMessage('Check YOLO.txt for output information');

							//check if any running processes are using the start-storybook script
							if(process.arguments[0].includes('storybook')){

								//stretch goal: check for multiple instances of storybook and reconcile

								// ---> OUTPUT LOGGER <--- //
								fs.appendFile(path.join(rootDir, 'YOLO.txt'), `This process matches for 'storybook'search string:\n
								PID: ${process.pid}, COMMAND:${process.command}, ARGUMENTS: ${process.arguments}\n`, (err) => {console.log(err)});

								//if so, extract port number and use that value to populate the webview with that contents
								const pFlagIndex = process.arguments.indexOf('-p');
								if (pFlagIndex !== -1){
									PORT = Number(process.arguments[pFlagIndex+1]);
								} else {
									//if no processes match 'storybook', we will have to spin up the storybook server
									//starts by extracting the existing storybook script in the package.json
									fs.readFile(path.join(rootDir, 'package.json'), (err, data) => {
										if (err){
											vscode.window.showErrorMessage(`Does this root folder contain a "package.json" file?`);
										}	else {
											//enter the package.JSON file and retrieve its contents as a string
											let packageJSONText = data.toString();

											// ---> OUTPUT LOGGER <--- //
											fs.appendFile(path.join(rootDir, 'YOLO.txt'), `Here is the full contents of the package.json file from the user's workspace folder:\n${packageJSONText}\n`, (err) => {console.log(err)});

											//find where the "storybook" script is defined
											let targetScriptStartIndex = packageJSONText.indexOf(`\"storybook\"\:`)+12;

											//retrieve the value (i.e. the entire line of text) of the "storybook" script
											let retrievedScript = packageJSONText.slice(targetScriptStartIndex, packageJSONText.indexOf(vscode.EndOfLine.toString()));

											// ---> OUTPUT LOGGER <--- //
											fs.appendFile(path.join(rootDir, 'YOLO.txt'), `This is what our readFile function (line 72) returns when it attempts to retrieve (line 82) the "storybook" script from  your app's package.json:\n${retrievedScript}\n`, (err) => {console.log(err)});

											//iterate through that text string and parse out important flags
											//it is more helpful to split it into an array separated by whitespace to grab these
											let retrievedScriptAsArray = retrievedScript.split(' ');
											for (let i = 0; i < retrievedScriptAsArray.length; i++){
												//add flags
												if (retrievedScriptAsArray[i] === '-p'){
													PORT = Number(retrievedScriptAsArray[i+1]);
												}
											}

											/*
											vscode.tasks.registerTaskProvider('runStorybook', {
												provideTasks(token?: vscode.CancellationToken) {
														return [
																new vscode.Task({type: 'runStorybook'}, vscode.TaskScope.Workspace,
																		"Aesop Chronicle", "aesop", new vscode.ShellExecution(`npm run storybook --ci`))
														];
												},
												resolveTask(task: vscode.Task, token?: vscode.CancellationToken) {
														return task;
												}
											});

											//define the script text to execute to the virtual terminal instance
											const bootScript = `storybook --ci`;
											const bootStorybook = new vscode.ProcessExecution(bootScript, {cwd: rootDir});

											//now create a virtual terminal and execute our special npm script for it
											//this first requires creating an eventEmitter that will fire that script
											const scriptEmitter = new vscode.EventEmitter<string>();
							
											//we also define a slave process Pseudoterminal (allowing Aesop to control the terminal)
											const pty: vscode.Pseudoterminal = {
												onDidWrite: scriptEmitter.event,
												open: () =>	scriptEmitter.fire(bootScript),
												close: () => {},
												handleInput: data => new vscode.ShellExecution(data)
											};

											//should this just be an active terminal/shellExecution?
											const virtualTerminal = vscode.window.createTerminal({name: 'sb-runner', pty});
											*/
										}
									})
								}
							}
						})
					}
				})
			}
		})

		//set the extension context equal to "aesop is running"
		// vscode.commands.executeCommand("setContext", "is-running-aesop", true);

		//still inside our disposable variable, let's create the webview panel
		const panel : vscode.WebviewPanel = vscode.window.createWebviewPanel(
			'aesop-sb',
			'Aesop',
			vscode.ViewColumn.Two,
			{
				enableCommandUris: true,
				enableScripts: true,
				// portMapping: [
				// 	{ webviewPort: PORT, extensionHostPort: PORT}
				// ]
			}
		);

		panel.webview.html =
			`<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Aesop</title>
				</head>
				<body>
					<iframe src="http://${host}:${PORT}/?path=/story/></iframe>
				</body>
			</html>`
	})

	context.subscriptions.push(disposable);
};

export function deactivate() {
	
}

/*
to-do:
	figure out how to iteratively call sb scripts within our webview
	webview messages / scripts to reload
	figure out how to use a tsx rule in webpack to execute scripts
	signal babel to interpret this block as tsx, e.g. something like: //@tsx babel//

//THIS WORKS, but we have no access to the DOM inside our webview//
	//now let's read SB's outputted index.html file, and parse out what we need
		fs.readFile(path.join(rootDir, '/node_modules/@storybook/core/dist/public/index.html'), (err, data) => {
			if (err) console.error(err);
			else {
				let pulledHTML = data.toString();
				let targetPoint = pulledHTML.indexOf('</body>');
				let firstHalf = pulledHTML.slice(0, targetPoint);
				let secondHalf = pulledHTML.slice(targetPoint);
				pulledHTML = firstHalf.concat(payloadScript).concat(secondHalf);
				fs.writeFile(path.join(rootDir, '/node_modules/@storybook/core/dist/public/index.html'), pulledHTML, (err) => {
					if (err) console.error(err);
					else {
						vscode.window.showInformationMessage('Successfully injected script');
					};
				});
			}
		});

	//declare an empty array (of strings) to push our scripts to during the next part
		const scriptArray : Array<string> = [];
		//define a path to the root working directory of the user
		const rootDir = fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));
		//now let's read SB's outputted index.html file, and parse out what we need
		fs.readFile(path.join(rootDir, '/node_modules/@storybook/core/dist/public/index.html'), (err, data) => {
			if (err) console.error(err);
			else {
				//if we've read the HTML file, take its contents and stringify it
				let outputFile = data.toString();
				// this log shows what our eventual permutations would look like as we carve out the scripts
				// vscode.window.showWarningMessage(`what's in it: ${outputFile.slice(outputFile.indexOf('<body>')+6, outputFile.indexOf('</body>'))} \n`)
				//split out the body section of the retrieved html file
				outputFile = outputFile.slice(outputFile.indexOf('<body>')+6, outputFile.indexOf('</body>'));
				vscode.window.showWarningMessage(`${outputFile} \n`)

				//this loop will peel out all the scripts so long as there are any to rip out
				while (outputFile.includes(`"<script src=`)){
					//we push just what we need (the src attributes), leaving the <script>...</script> tags behind
					let temp = outputFile.slice(outputFile.indexOf(`<script src="`)+12, outputFile.indexOf(`"></script>`));
					scriptArray.push(temp);
					outputFile = outputFile.slice(outputFile.indexOf(`"></script>`)+10);
				}
			};
		});

<div id="root"></div>
<div id="docs-root"></div>	
	<div id="scriptExecute">
	<script>window.acquireVsCodeApi = acquireVsCodeApi();</script>
	<script>window['DOCS_MODE'] = false;</script>
	<script>
		${
			scriptArray.map( (el) => {
				if (el.includes("./sb_dll")){
					let uiScript = document.createElement("script");
					uiScript.async = true;
					uiScript.defer = true;
					uiScript.referrerPolicy = "origin";
					uiScript.src = path.join(rootDir, `/node_modules/@storybook/core/dll/${el}`);
					document.getElementById("scriptExecute").appendChild(uiScript);
				}	else {
					let capturedScript = document.createElement("script");
					capturedScript.async = true;
					capturedScript.defer = true;
					capturedScript.referrerPolicy = "origin";
					capturedScript.src = path.join(rootDir, `/node_modules/@storybook/core/dist/public/${el}`);
					document.getElementById("scriptExecute").appendChild(capturedScript);
				}
			})
		}
	</script>
</div>

	disposable = vscode.commands.registerCommand('extension.getStories', () => {
		build a command that retrieves Storybook files on startup
		can be executed later if Storybook server is spun up after the extension opens
		
		also register this command at startup to crawl the file path
		${vscode.commands.executeCommand('extension.getStories')}
		vscode.window.showInformationMessage('Aesop is reading from your Storybook.');

		define a path to SB webpack bundle outputs (in user workspace /node_modules/ folder)
		if (vscode.workspace.workspaceFolders[0] !== undefined){
			const distGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "**(remove)/node_modules/@storybook/core/dist/public");
			//instantiate a watcher to listen for fs path changes (e.g. file creation/update)
			//bools = options for ignoreCreateEvents?, ignoreChangeEvents?, ignoreDeleteEvents?	
			const observer = vscode.workspace.createFileSystemWatcher(distGlob, false, false, false);
			// observer.onDidChange = //resolve//;		// observer.onDidCreate = //resolve//;
			//extract index.html file that outputs into SB's preview pane
			const htmlGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "*(remove)/node_modules/@storybook/core/dist/public/*.html");
			//extract necessary bundle scripts to leverage in-app dependencies
			const scriptGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "*(remove)/node_modules/@storybook/core/dist/public/*.js");

			console.log(vscode.Uri.file(fileURLToPath(`/node_modules/@storybook/core/dist/public`)));

			//do we need to resolve the Storybook UI script from the /dll/ folder?
			//if extract methods above fail, determine logic to parse out HTML/.js scripts (index 0?);
			//retrieve files with findFiles/relativeFilePath
			const arrayOfScripts = vscode.workspace.findFiles(distGlob, null, 100);
			//dev check: have we successfully pulled down script files?
			//if so, should we then store them locally, or is there no point?
			if (arrayOfScripts !== undefined){
				vscode.window.showInformationMessage("Hey, dog: " + `${arrayOfScripts}`);
			}

			vscode.window.showInformationMessage(`
			rootPath: ${vscode.workspace.workspaceFolders[0]},
			vscode.Uri: ${vscode.Uri},
			workspace: ${vscode.workspace},
			distGlob: ${distGlob.toString()},
			htmlGlob: ${htmlGlob.toString()},
			scriptGlob: ${scriptGlob.toString()}
			`);
		};

		vscode.window.showInformationMessage(`
			rootPath: ${vscode.workspace.workspaceFolders[0].uri.toString()},\n
			vscode URI parseTest: ${vscode.Uri.parse('file://'+ '/node_modules/@storybook/core/dist/public/index.html')},\n
			vscode URI parsed w escape: ${vscode.Uri.parse('file://'+ '/node_modules/\@storybook/core/dist/public/index.html')},\n
			vscode URI  file Test: ${vscode.Uri.file('node_modules/@storybook/core/dist/public/index.html')}
			`);
			
		console.log(`
		rootPath: ${vscode.workspace.workspaceFolders[0]},
		vscode.Uri: ${vscode.Uri},
		workspace: ${vscode.workspace},
		fileSys: ${vscode.Uri.file(path.join('/'))}`);
  });
  */