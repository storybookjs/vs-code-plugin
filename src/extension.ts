import * as vscode from 'vscode';
import * as express from 'express';
import { resolveCliPathFromVSCodeExecutablePath } from 'vscode-test';

//port should be variable to listen for action in the user's active terminal
const PORT = 6006;
const server = express();

export function activate(context: vscode.ExtensionContext) {
	server.get('http://localhost:6006', (req, res) => {
		vscode.window.showInformationMessage('Aesop server online');
		res.json();
	});
	server.listen(PORT);

	//create disposable variable type, registers awaken command & opens webview
	let disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {
		const panel = vscode.window.createWebviewPanel(
			'aesop-sb',
			'Aesop',
			vscode.ViewColumn.Beside,
			{
				enableScripts: true,
				portMapping: [
					//should extensionHostPort be variable to enable remote machine access?
					//PORT is presently undefined
					//how to use express with a d.ts file
					{ webviewPort: PORT, extensionHostPort: PORT }
				],
				// (!) look in to workspace file system access
				localResourceRoots: [vscode.Uri.file(context.extensionPath)]
			}
		);

		//{
		//also register this command at startup to crawl the file path
		// ${vscode.commands.executeCommand('extension.getStories')}
		// vscode.window.showInformationMessage('Aesop is reading from your Storybook.');
		//}

		//access the first opened folder of the workspace array
		//a potentially problematic assumption in multi-folder workspaces
		const rootPath = vscode.workspace.workspaceFolders[0];

		//define a path to SB webpack bundle outputs (in user workspace /node_modules/ folder)
		const distGlob = new vscode.RelativePattern(rootPath, "*/node_modules/@storybook/core/dist/public/");

		//instantiate a watcher to listen for fs path changes (e.g. file creation/update)
		//bools = options for ignoreCreateEvents?, ignoreChangeEvents?, ignoreDeleteEvents?
		const observer = vscode.workspace.createFileSystemWatcher(distGlob, false, false, true);
		// observer.onDidChange = /*resolve*/;
		// observer.onDidCreate = /*resolve*/;

		//extract the index.html file that outputs into SB's preview pane
		const htmlGlob = new vscode.RelativePattern(rootPath, "*/node_modules/@storybook/core/dist/public/*.html");
		//extract the necessary bundle scripts to leverage in-app dependencies
		const scriptGlob = new vscode.RelativePattern(rootPath, "*/node_modules/@storybook/core/dist/public/*.js");
		
		//do we need to resolve the Storybook UI script from the /dll/ folder?
		//if extract methods above fail, determine logic to parse out HTML/.js scripts (index 0?);

		//retrieve files with findFiles/relativeFilePath
		const arrayOfScripts = vscode.workspace.findFiles(distGlob, null, 100);

		//dev check: have we successfully pulled down script files?
		//if so, should we then store them locally, or is there no point?
		if (arrayOfScripts !== undefined){
			vscode.window.showInformationMessage("Hey, dog: " + arrayOfScripts);
		}

		//use retrieved info to fill out our HTML template inside the webview
		//figure out how to use a tsx rule in webpack
		//signal to babel to interpret this block as tsx, e.g.
		//something like: @ tsx babel// (to determine syntax)

		//a toggle for the background -> black if no stories to show
		const backgroundColor : String = (rootPath === undefined) ? "black" : "white";
		panel.webview.html = 
		`<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Aesop</title>
			<style>
				html { width: 100%; height: 100%; min-width: 20%; min-height: 20%;}
				body { display: flex; flex-flow: column nowrap; padding: 0; margin: 0; width: 100%' justify-content: center}
				iframe { border: none; background: ${backgroundColor}; min-width: 50%; max-height: 80%; vertical-align: center;}
			</style>
		</head>
		<body>
				<nav class="main_ui">
						<button onClick="vscode.commands.getStories()">Refresh Aesop</button>
				</nav>
				<iframe src=${htmlGlob}></iframe>
				<script>${arrayOfScripts}</script>
				</iframe>
		</body>
		</html>`;

		// vscode.window.showInformationMessage(`Aesop is ready to chronicle your stories!\n\nPlease use a command to begin: ${vscode.commands.getCommands(true)}`);
	});

	//subscribe this extension to the disposable
	context.subscriptions.push(disposable);

	//break up subscription pushes, and register each command sequentially.
	//this lets us overwrite "disposable," avoiding creation of unnecessary variables
	disposable = vscode.commands.registerCommand('extension.tollTheHour', () => {
		const nowadays = new Date(Date.now()).toTimeString();
		vscode.window.showInformationMessage(`The hour tolls: ${nowadays}`);
	});
	context.subscriptions.push(disposable);

	disposable = vscode.commands.registerCommand('extension.getStories', () => {
		//build a command that retrieves Storybook files on startup
		//can be executed later if Storybook server is spun up after the extension opens

		vscode.window.showInformationMessage(`Aesop has read the script in your webview HTML!`);
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {

}