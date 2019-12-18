import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {
		console.log('Aesop extension is ready to connect to Storybook.');
		vscode.window.showInformationMessage(`Aesop is ready to chronicle your stories!\n\nPlease use a command to begin: ${vscode.commands.getCommands(true)}`);
	});

	let disposable2 = vscode.commands.registerCommand('extension.tollTheHour', () => {
		const nowadays = new Date(Date.now()).toTimeString();
		vscode.window.showInformationMessage(`The hour tolls: ${nowadays}`);
	});
	context.subscriptions.push(disposable, disposable2);
}

/*** VSCode API brief:
  0. @VSCode General stuff to know
	1. @Interfacing with Storybook server
	2. @Targeting results at webview
	3. @UICommands (command palette, hotkeys, or UI) for retrieval/updates
	4. @uiOptimisation for SB buttons/display
	5. @newMVPFeatures that seem logical for MVP
	6. @stretchFeatures possible via VSCode API
***/

//0 - VSCode
/* disposable:
		 - a type that can release resources, such as event listening or a timer
		 - when functions are registered to listen, they are unregistered in their return
			 by returning a disposable
		 - ex) let disposable = vscode.commands.registerCommand('yo', callback() => {});

/* window:
		 - namespace for dealing with the current editor window
		 - VISIBLE and ACTIVE editors, as well as UI elements to show messages
			 selections, and ask for user input
		 - also has access to active terminals! useful for CLI monitoring
		 - can listen for window state changes, opens, closes, selection, etc.
		 - can create input boxes, output channels, status bar items, terminals
		 - also necessary to instantiate WEBVIEW PANELS
		 - can show info messages, dialog boxes, input panels, etc.
		 - Quick picks - selection dropwdown dialogs that appear in window (can map to
			mouse)

/* WEBVIEW vs WEBVIEWPANEL
		 - a webview displays HTML content, like an iframe
		 - a webviewPanel CONTAINS a webview (this is probably where we'll want to build
			 our extension UI)
		 - webviewPanelSerialisers are used to persist webviews across VSCode sessions!

window.withProgress (shows progress in the editor; progress is shown while running a given task callback and wile the promise it returned is not resolved nor rejected. Location to show this progress is defined via ProgressOptions.
	(Retrieving stories from Storybook...)


/* WebViewOptions:
	{
		enableCommandUris?,
		enableScripts?,
		localResourceRoots?,
		portMapping?, --> could it be this simple?
	}

/* Saving persisted state within a session:
			//within the webview
			const vscode = acquireVsCopeApi();
			//get existing state
			const oldState = vscode.getState() || {value: 0};
			//update state
			setState({ value: oldState.value + 1});

		serialisers extend this persistence across VSCode restarts - when shut down, VSCode will save off the state from setState of all webviews that have a serialiser. when first becoming visible after restart, the state is passed to deserialisewebviewPanel to restore old webviewPanel from this state.

/* Promises:
		The VS Code API represents asynchronous operations with promises. From extensions, any type of promise can be returned, like ES6, WinJS, A+, etc.

		Being independent of a specific promise library is expressed in the API by the Thenable-type. Thenable represents the common denominator which is the then method.

		In most cases the use of promises is optional and when VS Code calls into an extension, it can handle the result type as well as a Thenable of the result type. When the use of a promise is optional, the API indicates this by returning or-types.

		provideNumber(): number | Thenable<number

/* Events:
		exposed as fns, which you call with a listener-fn to subscribe. calls to subscribe return disposables (removing the event listener upon dispose)

			var listener = function(e){
				console.log('Event occurred', e);
			};

			//start listening
			var subscription = fsWatcher.onDidDelete(listener);

			//do more stuff
			subscription.dispose();

/* window.createWebviewPanel(
			viewType: string,
			title: string,
			showOptions: ViewColumn |
				{preserveFocus: boolean (should it auto switch to select that column?)},
				viewColumn: ViewColumn},
			options?: WebViewPanelOptions & WebViewOptions
			);

WebViewPanelOptions & WebViewOptions
/* scm (SourceControl):
		 - scm's only method is createSourceControl()
		 - SourceControl - interface for providing resource states(?) to the editor
		 - can interact with the editor in several source control related ways
		 - can be represented/controlled with an input box in the SC viewlet

WORKSPACE - where all the file system logic is listened for and performed
			WORKSPACE CLASSES:
			/* breakpoints:
					- base class of all breakpoints (end the process at defined hitConditions);
			/*callHierarchy (Item, IncomingCall, OutgoingCall, HierarchyProvider, etc.)
					- represents programming constructs like constructors or functions in the context of a call hierarchy
			/* CancellationToken - passed to asynchronous or long-running operations to request cancellation, like cancelling a request for auto-complete entries bc the user continued to type
			/* CharacterPair - tuple, e.g. [string, string]
			/* Clipboard - accesses the system's clipboard
			/* CodeAction - a change performed in code, e.g. to fix problems or refactor (could also be used to update test cases!)
			/* Color (r:, g:, b:, a:) / ColorPresentation (that defined color's presentation name, e.g. "Spicy Pink")
			/* CustomExecution - execute an extension callback as a task
			/* EventEmitter - to create and manage
			/* tasks:
				- interface for executing, listing, or registering providers for VSCode tasks
				- fetchTasks() - returns all tasks available in the systems(?)
			/*TypeDefinitionProvider - defines the contract between extensions and the go-to type definition feature (could be useful for simulating SB documentation)
			/*UI Kind - possible kinds of UI that can use extensions
			/* VIEWCOLUMN - location of an editor in the window
			(https://code.visualstudio.com/api/references/vscode-api#ViewColumn)
*/

//2 - @Interfacing

/*URI handler-- creates a URI that, if opened in a browser, will result in a 
                registered URIHandler to trigger

	window.registerUriHandler()
	 - registers a uri handler capable of handling system-wide URIs. If multiple windows are open, the topmost handles the URI. A uri handler is scoped to the extension it is CONTRIBUTED FROM; it can only handle URIs which are direction to the EXTENSION ITESELF.
	uri-authority: must be the extension id (e.g. aesop);
	uri-scheme: must be vscode.env.uriScheme

	
	naive flow:
-->* TO CHECK IF THIS IS HOW THE STORYBOOK-VSCODE preview extension WORKS

	- watch for and piggyback on Storybook localhost:6006// connection
	- proxy to our defined URI, then trigger retrieval of stories w/UriHandler

	optimised flow:
-->* TO LOOK INTO port forwarding tunnels as opened by asExternalUri

	- do not block Storybook from booting up its dev server (play nice);
	- mount another dev server inside VSCode (that natively browses file path?)
	- write an npm script that allows to spin up either Storybook offish or ours

																		*/

//3 - @NewFeaturesMVP

/*
commands:
registerTextEditorCommand(command: string, callback: (textEditor, edit: TextEditorEdit));
- this might allow us to provide input fields for parsed stateful properties
- allow overwrite of predefined test cases dynamically, assert input values in-line
  in the .stories.js file in the fs
*/

/*
debug console-- debug interface, can log error messages, catch conflicts/syntax
  - to test GUI and problematise breakpoints
	- e.g. connecting to SB, retrieving/updating stories, posting updates to stories
*/

//4 - @StretchFeatures
/*
env -- environment the extension runs in, e.g. VSCode and relevant metadata about 				 a live instance of the VSCode desktop app
  - add time coding feature that pings, "remember to take breaks"
	- can set global ship time, get updates at specified time of remaining time
*/

/*
commands:
commentController()
	- enable devs to leave comments for themselves that would persist while working
	- use case: problematise issues with component to feed back to team
		(essentially action items), insert them into the text editor for peer code review
	- lifecyle of comment controller: instantiate(commentingRangeProvider: specific files where commenting can apply, id, label(human-readable), reactionHandler --> creates/deletes reactions to comment), (thread), dispose();
	- SEE ALSO: https://github.com/Microsoft/vscode/issues/53598
*/

/*
extensions -- namespace to interface with other extensions
	- requires extensionDependency entry to extension package.json
	- getExtension() function and exports property of that extension
	- can be passed 'all' variable (all extensions), and listen for extension installs
*/

/*
languages -- namespace that can interace with language-specific editor features, e.g.
						 Intellisense, code actions, diagnostics, word-completion, navigation, code-checking, etc.
	- the editor can track mouse position, we can register a hover (toggle magnet
		mode: check what the active file is, auto-flip to the correlating story for
		that component)
	- documentSelector / match() function --> probably useful for the above
	- can display what language you are using
	- can highlight text within an editor; mouseOver props fields in our UI, show
		where in the code such props 
	- linkProvider - can establish links to files; returns disposable to unregister 
		the provider when being disposed
--> TO LOOK INTO: arity scoring to determine the order of provider participation
*/








// this method is called when your extension is deactivated
export function deactivate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.aesopSlumber', () => {
		//this message says goodbye to the user when closing Aesop
		vscode.window.showInformationMessage(`Aesop slumbers. Thank you for chronicling your Storybook with Aesop.`);
	});

	context.subscriptions.push(disposable);
}