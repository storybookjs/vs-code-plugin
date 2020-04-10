import * as vscode from 'vscode';
import { fileURLToPath } from 'url';
import * as events from 'events';
import sbChecks from './utils/sbChecks';
import logger from './utils/logger'
import AesopViewCreator from './webview/create-webview';
import ProcessService from './processes/process.service'


export function activate(context: vscode.ExtensionContext) {
	//possibly just have multiple event emitters and then structure it like express



	//define PORT and host variables to feed the webview content from SB server
	let PORT: number;
	let host: string = 'localhost';//arl
	const aesopEmitter = new events.EventEmitter();
	let emittedAesop = false;

	let currentPanel: vscode.WebviewPanel | undefined = undefined;
	//@TODO: if aesop already opened sb in webview - subsequent calls to aesop should not open a new webview

	//set context "aesop-awake" to true; enabling views
	vscode.commands.executeCommand("setContext", "aesop-awake", true);

	//create the status bar to let the user know what Aesop is doing

	//create status could also be modularized
	const statusText = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 7);
	statusText.text = "Aesop is finding your Storybook dependency..."
	statusText.color = "#FFFFFF";
	statusText.command = undefined;
	statusText.tooltip = "Aesop status";

	//create disposable to register Aesop Awaken command to subscriptions
	let disposable: vscode.Disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {
		statusText.show();


		//define a path to the user's root working directory
		const rootDir: string = fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));
		const sbChecker = new sbChecks(rootDir, vscode);
		const processService = new ProcessService(rootDir, vscode, statusText);
		const viewCreator = new AesopViewCreator(vscode, context, statusText, currentPanel)

		sbChecker.dependency();
		const process = sbChecker.nodeProc();
		const resultsList = process.then(({ status, payload }) => {
			if (status) return sbChecker.storyBookProc(payload)
		})
		const portBool = resultsList.then(({ status, payload }) => {
			if (status) return processService.locationViaPort(payload)
		})
		let port = portBool.then(({ status, payload }) => {
			if (status) return processService.locationViaNetStat(payload);
		})



		// aesopEmitter.on('sb_on', () => {
		// 	logger.write(`Attempting to create webview panel`);
		// 	createAesop(PORT, host);
		// });





	}); //close disposable

	context.subscriptions.push(disposable);
}


export function deactivate() {
	process.exit();
}
