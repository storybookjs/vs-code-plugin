"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
// import * as express from 'express';
// import MainUI from './toolbars/main_ui.ts';
const PORT = 6006;
function activate(context) {
    // const app = express();
    // app.get('/', (_req, res) => res.status(200).send('Connected'));
    // app.listen(PORT);
    //create disposable variable type, registers awaken command & opens webview
    let disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {
        const panel = vscode.window.createWebviewPanel('aesop-sb', 'Aesop', vscode.ViewColumn.Beside, {
            enableScripts: true,
            portMapping: [
                //extensionHostPort should be variable to enable remote machine access
                { webviewPort: PORT, extensionHostPort: PORT }
            ],
            //look in to workspace file system access
            localResourceRoots: [vscode.Uri.file(context.extensionPath)]
        });
        panel.webview.html =
            `<!DOCTYPE html>
		<html lang="en">
		<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Aesop</title>
				<style>
				html { width: 100%; height: 100%; min-height: 100%; display: flex; }
				body { flex: 1; display: flex; }
				iframe { flex: 1; border: none; background: white; }
		</style>
		</head>
		<body>
				<nav class="main_ui">
					<div>
						<button></button>
						<button></button>
						<button></button>
					</div>
					${vscode.commands.executeCommand('extension.getStories')}
				</nav>
				<iframe src="http://localhost:${PORT}"></iframe>
				<img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
		</body>
		</html>`;
        console.log('Aesop is reading from your Storybook.');
        vscode.window.showInformationMessage(`Aesop is ready to chronicle your stories!\n\nPlease use a command to begin: ${vscode.commands.getCommands(true)}`);
    });
    //subscribe this extension to the disposable
    context.subscriptions.push(disposable);
    //breaking up subscription pushes to register each command sequentially allows us
    //to overwrite the disposable, avoiding the creation of unnecessary variables
    disposable = vscode.commands.registerCommand('extension.tollTheHour', () => {
        const nowadays = new Date(Date.now()).toTimeString();
        vscode.window.showInformationMessage(`The hour tolls: ${nowadays}`);
    });
    context.subscriptions.push(disposable);
    disposable = vscode.commands.registerCommand('extension.getStories', () => {
        //business logic for generating the first instantiation of Storybook;
        vscode.window.showInformationMessage(`Aesop has read the script in your webview HTML!`);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// let mediaPath = vscode.Uri.file(path.join(context.extensionPath, 'media')).with({
// 	scheme: "vscode-resource"
// }).toString() + '/';
// webview.html = `
// <base href="${mediaPath}">
// <img src="vscode.png"/>    
// `;
// webview.onRequestMade((request) => {
//   if (request.uri.scheme == 'media') {
//      request.uri.scheme = 'vscode-resource';
//      request.uri.path = path.join(extensionPath, request.uri.path);
//   }
//   return request;
// });
// this method is called when your extension is deactivated
function deactivate(context) {
    //this message says goodbye to the user when closing Aesop
    vscode.window.showInformationMessage(`Aesop slumbers. Thank you for chronicling your Storybook with Aesop.`);
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map