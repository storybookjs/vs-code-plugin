import * as vscode from 'vscode';
import { fileURLToPath } from 'url';
import * as events from 'events';
import sbChecks from './utils/sbChecks';
import logger from './utils/logger';
import AesopViewCreator from './webview/create-webview';
import ProcessService from './processes/process.service'


export function activate(context: vscode.ExtensionContext) {
	//define PORT and host variables to feed the webview content from SB server
	const fileName: string = 'extension.ts';
	const aesopEmitter = new events.EventEmitter();

	let currentPanel: vscode.WebviewPanel | undefined = undefined;
	//@TODO: if aesop already opened sb in webview - subsequent calls to aesop should not open a new webview

	//set context "aesop-awake" to true; enabling views
	vscode.commands.executeCommand("setContext", "aesop-awake", true);


	//create status could also be modularized or removed since we have a progress bar
	const statusText = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 7);
	statusText.text = "Aesop is finding your Storybook dependency..."
	statusText.color = "#FFFFFF";
	statusText.command = undefined;
	statusText.tooltip = "Aesop status";

	//create disposable to register Aesop Awaken command to subscriptions
	let disposable: vscode.Disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {
		aesopEmitter.removeAllListeners();
		statusText.show();

		//creates progress bar during run up of webview
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			title: `Running Aesop For Storybook`,
			cancellable: true
		}, (progress, token) => {
			//if a user hits the cancel button on the loading message, the process ends
			token.onCancellationRequested(() => {
				logger.write(`User has cancelled Aesop`, fileName, 'withProgress');
				statusText.dispose();
				process.exit(1);
			});

			//for each stage of the startup, increment the progress counter

			aesopEmitter.once('found_dependency', () => progress.report({ message: 'Found the Storybook Dependency', increment: 10 }));
			aesopEmitter.once('found_nodeps', () => progress.report({ message: `Found Node Processes`, increment: 25 }));
			aesopEmitter.once('found_storybookps', () => progress.report({ message: `Found a Storybook Process`, increment: 40 }));
			aesopEmitter.once('start_storybook', () => progress.report({ message: `Starting Storybook for you`, increment: 40 }));
			aesopEmitter.once('create_webview', () => progress.report({ message: `Creating Webview`, increment: 25 }));

			//once the returned promise resolves, the loading message disappears
			var p = new Promise(resolve => {
				return aesopEmitter.once('create_webview', () => resolve());
			});

			return p;
		})



		//define a path to the user's root working directory
		const rootDir: string = fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));

		//manual dependency injection
		//declare core vscode functionality to be injected into services
		const vscodeDepPack = {
			vscode,
			rootDir,
			statusText,
			currentPanel,
			aesopEmitter,
			context
		}

		//each service deconstructs what it needs and stores the references in the constructor
		//maybe rename sbChecker to validatorService
		const sbChecker = new sbChecks(vscodeDepPack);
		const processService = new ProcessService(vscodeDepPack);
		const viewCreator = new AesopViewCreator(vscodeDepPack);

		//event listeners used to keep track of function order
		const errorHandler = (error) => {
			vscode.window.showErrorMessage(`Something went wrong!`)
			statusText.dispose();
			logger.write(error, fileName, 'errorHandler');
			process.exit()
		}

		//probably should wrap the creation of these event handlers in a function and store on a different file

		aesopEmitter.on('error', errorHandler)
		process.on('unhandledRejection', errorHandler)

		aesopEmitter.once('found_dependency', sbChecker.nodeProc);
		aesopEmitter.once('found_nodeps', sbChecker.storyBookProc);
		aesopEmitter.once('found_storybookps', processService.findLocation);
		aesopEmitter.once('start_storybook', processService.startStorybook);
		aesopEmitter.once('create_webview', viewCreator.createAesop);

		//kickstart process
		sbChecker.dependency();

	}); //close disposable

	context.subscriptions.push(disposable);
}


export function deactivate() {
	process.exit();
}
