import * as vscode from 'vscode';
import * as express from 'express';
import { resolveCliPathFromVSCodeExecutablePath } from 'vscode-test';
import { pathToFileURL, fileURLToPath } from 'url';

const { spawn } = require('child_process');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter()

const ps = require('ps-node')

//declare then host variable for launching storybook
const host = "localhost"

export function activate(context: vscode.ExtensionContext) {
	// declare port and set to null => port to be changed later
		let port = null;

		let disposable : vscode.Disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {
			// grab the workspace root folder
			const root = fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));
			
			// look up currently running processes
			ps.lookup({
				command: 'node',
				psargs: 'ux',
			}, (err, resultList) => {
				// need to handle what to do incase of an error
				if (err) {
				throw new Error(err);
				}
				
				// also need to handle what to do if no error but no process running at all
				//no process running also means story-book not running

				else {
					// set found storybook to false
					let foundSb = false;

					resultList.forEach((process) => {
						if (process.arguments[0].includes('start-storybook')) {
							vscode.window.showInformationMessage("You have storybook currently running..!")
							const sbProcess = process.arguments;
							const sbPortFlag = '-p'
							const indexOfP = sbProcess.indexOf(sbPortFlag);
							if(indexOfP !== -1){
							console.log(`current sb port: ${sbProcess[indexOfP+1]}`);
							port = Number(`${sbProcess[indexOfP+1]}`)
							}
							console.log(`port from lookup is: `, port);
							// change found storybook to true
							foundSb = true;
							// event emitter will invoke the create webview function 
							myEmitter.emit('sb_on')
						}
					});
					// check if found storybook is still false => no storybook running
					if (foundSb === false) {

						// spin up storybook
						const runSb = spawn('npm', ['run', 'storybook'], {cwd: root});
				
						vscode.window.showInformationMessage("We are now running storybook for you!")
						// if error running sb throw an error
						runSb.on('error', function(err) {
							vscode.window.showInformationMessage(err);
							process.exit(1);
						});
						
						runSb.stdout.setEncoding('utf8')
						// grab the stdout output
						runSb.stdout.on('data', (data) => {
						console.log(`stdout: ${data}`);
						let str = data.toString(), lines = str.split(" ");
							// declare a variable for the port flag
						const sbPortFlag = '-p';
							// check if the port flag is in the stdout output
						if (lines.includes(sbPortFlag)){
							const indexOfP = lines.indexOf(sbPortFlag);
							// if port flag is found then grab the port which is in the next index
							if(indexOfP !== -1) {
								port = parseInt(lines[indexOfP + 1])
								vscode.window.showInformationMessage(`storybook is now running on port:`, port);
								myEmitter.emit('sb_on')
							}
						}

						});

						//This will make sure the child process is terminated on process exit
						runSb.on('close', (code) => {
						console.log(`child process exited with code ${code}`);
						});
		  
						}
				
				}
				// event emitter to create webview panel
				myEmitter.on('sb_on', ()=>{
					
					const panel = vscode.window.createWebviewPanel(
						'aesop-sb',
						'Aesop',
						vscode.ViewColumn.Three,
						{
							enableScripts: true,
							localResourceRoots: [vscode.Uri.file(context.extensionPath)]
						}
					);
	
					
					panel.webview.html = `<!DOCTYPE html>
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
					<body id="root">
				
					<iframe src="http://${host}:${port}/?path=/story/task--default" width="100%" height="500"></iframe>
					<p>If you're seeing this, something is wrong :) (can't find server at ${host}:${port})</p>
					<span>Let's put some content here v61</span>
					</body>
					</html>`;
	
				});
	
	
			vscode.window.showInformationMessage(`Aesop is ready to chronicle your stories!`);
			})
	});
	
	context.subscriptions.push(disposable);
	

	disposable = vscode.commands.registerCommand('extension.getStories', () => {
		//build a command that retrieves Storybook files on startup
		//can be executed later if Storybook server is spun up after the extension opens
		
		//also register this command at startup to crawl the file path
		// ${vscode.commands.executeCommand('extension.getStories')}
		// vscode.window.showInformationMessage('Aesop is reading from your Storybook.');

		console.log(vscode.Uri.file(fileURLToPath(`/node_modules/@storybook/core/dist/public`)));

		//define a path to SB webpack bundle outputs (in user workspace /node_modules/ folder)
		const distGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "**/node_modules/@storybook/core/dist/public");

		//instantiate a watcher to listen for fs path changes (e.g. file creation/update)
		//bools = options for ignoreCreateEvents?, ignoreChangeEvents?, ignoreDeleteEvents?
		// observer.onDidChange = /*resolve*/;		// observer.onDidCreate = /*resolve*/;
		const observer = vscode.workspace.createFileSystemWatcher(distGlob, false, false, false);
		
		//extract index.html file that outputs into SB's preview pane
		const htmlGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "*/node_modules/@storybook/core/dist/public/*.html");
		//extract necessary bundle scripts to leverage in-app dependencies
		const scriptGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "*/node_modules/@storybook/core/dist/public/*.js");
		
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

		console.log(`
		rootPath: ${vscode.workspace.workspaceFolders[0]},
		vscode.Uri: ${vscode.Uri},
		workspace: ${vscode.workspace},
		distGlob: ${distGlob.toString()},
		htmlGlob: ${htmlGlob.toString()},
		scriptGlob: ${scriptGlob.toString()}
		`);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}