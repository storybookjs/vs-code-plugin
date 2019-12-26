import * as vscode from 'vscode';
import * as express from 'express';
import { resolveCliPathFromVSCodeExecutablePath } from 'vscode-test';
import { pathToFileURL, fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';

//port should be variable to listen for action in the user's active terminal
// const PORT = 6006;
// const server = express();

export function activate(context: vscode.ExtensionContext) {
	// server.get('/', (req, res) => {
	// 	vscode.window.showInformationMessage('Aesop server online');
	// 	res.end();
	// });
	// server.listen(PORT);

	//create disposable variable type, registers awaken command & opens webview
	let disposable : vscode.Disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {
		
		const panel = vscode.window.createWebviewPanel(
			'aesop-sb',
			'Aesop',
			vscode.ViewColumn.Three,
			{
				enableCommandUris: true,
				enableScripts: true,
				portMapping: [
					{ webviewPort: 6006, extensionHostPort: 9009}
				],
				localResourceRoots: [vscode.workspace.workspaceFolders[0].uri]
			}
		);

// <script src="${path.join(vscode.workspace.workspaceFolders[0].toString(), 'node_modules/@storybook/core/dist/public', '*.js')}"></script>

		panel.webview.html = `<!DOCTYPE html>
		<html lang="en">
		<head>
		<style>
		body {
			display: flex;
			flex-flow: column nowrap;
			padding: 0;
			margin: 0;
			width: 100%;
			justify-content: center
		}
		iframe {
			border: none;
			background: blue;
			min-width: 50%;
			max-height: 100%;
			min-height: 80%;
			vertical-align: center;
		}
		</style>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Aesop</title>
		<script>window.acquireVsCodeApi = acquireVsCodeApi;</script>
		</head>

		<body>
		<iframe src="http://localhost:6006"></iframe>
		</body>
		</html>`;

		const altPanel = vscode.window.createWebviewPanel("alt", "AltWebView", vscode.ViewColumn.Four, {
			enableCommandUris: true,
			enableScripts: true,
			localResourceRoots: [vscode.workspace.workspaceFolders[0].uri]
		});

		const rootDir = fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));
		// const rootDir2 = vscode.workspace.workspaceFolders[0].uri.toString(true);
		// const rootDir3 = vscode.workspace.workspaceFolders[0].uri.toString();
		vscode.window.showInformationMessage(`${path.join(rootDir, '/node_modules/@storybook/core/dist/public/index.html')}`);
		// vscode.window.showInformationMessage(`rootDir stringifiedURI: ${rootDir2}`);
		// vscode.window.showInformationMessage(`rootDir encoded: ${rootDir3}`);
		
		fs.readFile(path.join(rootDir, '/node_modules/@storybook/core/dist/public/index.html'), (err, data) => {
			if (err) console.error(err);
			else {
				altPanel.webview.html = data.toString();
				vscode.window.showWarningMessage(data.toString());
				vscode.window.showInformationMessage('Entered SB /dist/ folder');
			}
		});
	});
	
	context.subscriptions.push(disposable);

	// to-do:
	// figure out how to launch dev remote host
	// figure out how to iteratively call sb script
	// webview messages / scripts
	// use retrieved info to fill out our HTML template inside the webview
	// figure out how to use a tsx rule in webpack
	// signal to babel to interpret this block as tsx, e.g.
	// something like: @ tsx babel// (to determine syntax)

	disposable = vscode.commands.registerCommand('extension.getStories', () => {
		//build a command that retrieves Storybook files on startup
		//can be executed later if Storybook server is spun up after the extension opens
		
		//also register this command at startup to crawl the file path
		// ${vscode.commands.executeCommand('extension.getStories')}
		// vscode.window.showInformationMessage('Aesop is reading from your Storybook.');

		//define a path to SB webpack bundle outputs (in user workspace /node_modules/ folder)
		// if (vscode.workspace.workspaceFolders[0] !== undefined){
		// 	const distGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "**/node_modules/@storybook/core/dist/public");
		// 	//instantiate a watcher to listen for fs path changes (e.g. file creation/update)
		// 	//bools = options for ignoreCreateEvents?, ignoreChangeEvents?, ignoreDeleteEvents?	
		// 	const observer = vscode.workspace.createFileSystemWatcher(distGlob, false, false, false);
		// 	// observer.onDidChange = /*resolve*/;		// observer.onDidCreate = /*resolve*/;
		// 	//extract index.html file that outputs into SB's preview pane
		// 	const htmlGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "*/node_modules/@storybook/core/dist/public/*.html");
		// 	//extract necessary bundle scripts to leverage in-app dependencies
		// 	const scriptGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "*/node_modules/@storybook/core/dist/public/*.js");

		// 	console.log(vscode.Uri.file(fileURLToPath(`/node_modules/@storybook/core/dist/public`)));

		// 	//do we need to resolve the Storybook UI script from the /dll/ folder?
		// 	//if extract methods above fail, determine logic to parse out HTML/.js scripts (index 0?);
		// 	//retrieve files with findFiles/relativeFilePath
		// 	const arrayOfScripts = vscode.workspace.findFiles(distGlob, null, 100);
		// 	//dev check: have we successfully pulled down script files?
		// 	//if so, should we then store them locally, or is there no point?
		// 	if (arrayOfScripts !== undefined){
		// 		vscode.window.showInformationMessage("Hey, dog: " + `${arrayOfScripts}`);
		// 	}

		// 	vscode.window.showInformationMessage(`
		// 	rootPath: ${vscode.workspace.workspaceFolders[0]},
		// 	vscode.Uri: ${vscode.Uri},
		// 	workspace: ${vscode.workspace},
		// 	distGlob: ${distGlob.toString()},
		// 	htmlGlob: ${htmlGlob.toString()},
		// 	scriptGlob: ${scriptGlob.toString()}
		// 	`);
		// };

		// vscode.window.showInformationMessage(`
		// 	rootPath: ${vscode.workspace.workspaceFolders[0].uri.toString()},\n
		// 	vscode URI parseTest: ${vscode.Uri.parse('file://'+ '/node_modules/@storybook/core/dist/public/index.html')},\n
		// 	vscode URI parsed w escape: ${vscode.Uri.parse('file://'+ '/node_modules/\@storybook/core/dist/public/index.html')},\n
		// 	vscode URI  file Test: ${vscode.Uri.file('node_modules/@storybook/core/dist/public/index.html')}
		// 	`);
			

		// console.log(`
		// rootPath: ${vscode.workspace.workspaceFolders[0]},
		// vscode.Uri: ${vscode.Uri},
		// workspace: ${vscode.workspace},
		// fileSys: ${vscode.Uri.file(path.join('/'))}`);
	});

	context.subscriptions.push(disposable);
};

export function deactivate() {}