import * as vscode from 'vscode';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as ps from 'ps-node';
import * as child_process from 'child_process';
import * as events from 'events';
import * as os from 'os';

const aesopEmitter = new events.EventEmitter();

// import { Channel, ChannelHandler } from '@storybook/channels';
// import createChannel from "@storybook/channel-websocket"
// import * as WebSocket from 'ws';
// import { TreeViewProvider, StoryObject, Story } from "./treeviewProvider"
// import { QuickPickProvider, StorySelection } from "./quickpickProvider"

// const g = global as any;
// g.WebSocket = WebSocket;
// let storybooksChannel: any;
// let establishedConnection : boolean = false;

/* EXPRESS SERVER & DEPENDENCY

import * as express from 'express';
import { resolveCliPathFromVSCodeExecutablePath } from 'vscode-test';
const server = express();

*/
/*
	class AesopPanel implements vscode.WebviewPanel {
		viewType
		title: string = 'Aesop'
		webview: vscode.Webview = new AesopWebview
		options: {retainContextWhenHidden: true}
		viewColumn: vscode.ViewColumn.Beside
		active: boolean = true
		visible: boolean = true
		onDidChangeViewState
		onDidDispose
		reveal
	}

	class AesopWebview implements vscode.Webview{
		asWebviewUri: any
		onDidReceiveMessage: any
		postMessage: any
		cspSource: any
		html: string =
		`<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Aesop</title>
			</head>
			<body>
				<iframe src="http://${host}:${PORT}/?path=/story/welcome--to-storybook></iframe>
			</body>
		</html>`
		options: vscode.WebviewOptions = new AesopWVOptions
	}

	class AesopWVOptions implements vscode.WebviewOptions{
		enableCommandUris: boolean = true
		enableScripts: boolean = true
		portMapping: [{
			webviewPort: number,
			extensionHostPort: number
		}]
	}

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
/* EXPRESS SERVER

	server.get('/', (req, res) => {
		vscode.window.showInformationMessage('Aesop server online');
		res.end();
	});
	server.listen(PORT);

*/
	/*
	//we need this to interface with/emit events to the storybook-channels websocket library
	let previewUri = vscode.Uri.parse("storybook://authority/preview")

	class WebviewHTMLProvider implements vscode.TextDocumentContentProvider {
		public provideTextDocumentContent(uri: vscode.Uri): string {
			//do we need to pass these arguments to the webviewprovider from our processes?
			//https://code.visualstudio.com/api/references/vscode-api#WorkspaceConfiguration
			//UPDATE configuration when found

			//'PORT' and 'host' have defaults configured manually in the package.json
			const port = vscode.workspace.getConfiguration("aesop").get("port")
			const host = vscode.workspace.getConfiguration("aesop").get("host")

			//this return value is what would normally get popped into the preview --> /?path=/story/${storyUri}
			return `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Aesop</title>
					<style>
					iframe {
						position: fixed;
						border: none;
						padding: 0;
						margins: 0;
						width: 100%;
						height: 100%;
					}
				</style>
				</head>
				<body>
					<iframe src="http://${host}:${port}></iframe>
				</body>
			</html>`
		}
	}

	let provider = new WebviewHTMLProvider();
	let webviewHTMLRegistration = vscode.workspace.registerTextDocumentContentProvider("storybook", provider);

	//"storybook" is the scheme here; where is that defined? contributes?
	const storyTreeViewProvider = new TreeViewProvider();
	vscode.window.registerTreeDataProvider("storybook", storyTreeViewProvider);
	const pickerProvider = new QuickPickProvider(storyTreeViewProvider);

	let previewDisposable = vscode.commands.registerCommand("extension.showStorybookPreview", () => {
		//maybe we can use a blank webview and REASSIGN its html each time with a boilerplate HTML file and an iframe spot for the html fired at previewHtml here

		return vscode.commands.executeCommand("vscode.previewHtml", previewUri, vscode.ViewColumn.Two, "Storybooks").then(
      success => {},
      //should really (by convention) use a .catch() method for the error (call it "error", not "reason")
      reason => {
        vscode.window.showErrorMessage(reason)
      }
    )
	})

	context.subscriptions.push(previewDisposable, webviewHTMLRegistration);

	storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })

  //declares variables with no initial value, reassigns at each request
  var currentKind: string = null
  var currentStory: string = null
  var currentStoryId: string = null

  // Create a statusbar item to reconnect, when we lose connection
  const reconnectStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
  reconnectStatusBarItem.command = "extension.restartConnectionToStorybooks"
  if (establishedConnection) {
    reconnectStatusBarItem.text = "Reconnect Storybooks"
    reconnectStatusBarItem.color = "#FF8989"
  } else {
    reconnectStatusBarItem.text = "Connect to Storybooks"
  }

  reconnectStatusBarItem.hide()

  // when we (re-)connect to Storybook's server, pass the WS connection to this func, so callbacks can occur on new socket connection

  const registerCallbacks = channel => {

    // Called when we first get stories from the Storybook server
    // may have to add logic that executes a getStories command after the webview has been served up by the primary Aesop Awaken function
    //setStories is a method defined on the websocket connection

    channel.on("setStories", data => {
      //this configuration exists in package.json, and defines a filter that is initialised to a "."
      //this is probably configurable in the extension settings, something we still have to tackle
      //we should also think about the store presentation, logo, Readme...

      //TO FOLLOW UP: why use this filter? what is it reading? the DOM on the server?

      const filter = vscode.workspace.getConfiguration("react-native-storybooks").get("storybookFilterRegex") as string
      const regex = new RegExp(filter)

      //use Story interface to init this variable (id: string, name: string)
      let stories: Story[] = []

      //gets the data returned from the socket when calling setStories, we see if the data has a property "stories" which contains an Array of usable elements

      if (Array.isArray(data.stories)) {
        //if the data contains a stories property that is an Array
        //declare a variable kinds that:
        //inits to an empty Object but takes a type assertion of:
        //Object -> [key]: value = array of Story Objects
        
        let kinds: { [key: string]: StoryObject[] } = {}
        //this is basically asking if the stories returned from the data have a "kind" property, and if the kind contains a period
        const storydata = data.stories.filter(s => s.kind.match(regex))

        storydata.map(story => {
          story.stories.map(singleStory => {
            if (kinds[story.kind] == undefined) {
              // kinds[story.kind] = [story.name]
              kinds[story.kind] = [{ name: singleStory, id: singleStory }]
            } else {
              kinds[story.kind].push({ name: singleStory, id: singleStory })
            }
          })
        })
        Object.keys(kinds).forEach(function(key) {
          stories.push({
            kind: key,
            stories: kinds[key]
          })
        })
      } else {
        let kinds: { [key: string]: StoryObject[] } = {}
        Object.keys(data.stories).forEach(function(key) {
          const story = data.stories[key]
          if (story.kind.match(regex)) {
            if (kinds[story.kind] == undefined) {
              // kinds[story.kind] = [story.name]
              kinds[story.kind] = [{ name: story.name, id: story.id }]
            } else {
              kinds[story.kind].push({ name: story.name, id: story.id })
            }
          }
        })
        Object.keys(kinds).forEach(function(key) {
          stories.push({
            kind: key,
            stories: kinds[key]
          })
        })
      }
      storyTreeViewProvider.stories = stories
      storyTreeViewProvider.refresh()
      reconnectStatusBarItem.hide()
    })

    // When the server in RN starts up, it asks what should be default
    channel.on("getCurrentStory", () => {
      storybooksChannel.emit("setCurrentStory", {
        storyId: currentStoryId
      })
    })

    // The React Native server has closed
    channel.transport.socket.onclose = () => {
      storyTreeViewProvider.stories = []
      storyTreeViewProvider.refresh()
      reconnectStatusBarItem.show()
    }

    channel.emit("getStories")
  }

  registerCallbacks(storybooksChannel)

  vscode.commands.registerCommand("extension.searchStories", () => {
    vscode.window.showQuickPick(pickerProvider.toList()).then((picked: string) => {
      const setParams = pickerProvider.getParts(picked)
      setCurrentStory(setParams)
    })
  })

  // Allow clicking, and keep state on what is selected
  vscode.commands.registerCommand("extension.openStory", (section, story) => {
    // Handle a Double click
    if (currentStoryId === story.id && currentKind === section.kind && currentStory === story.name) {
      findFileForStory(section.kind, story.name).then(results => {
        if (results) {
          vscode.workspace.openTextDocument(results.uri).then(doc => {
            vscode.window.showTextDocument(doc).then(shownDoc => {
              let range = doc.lineAt(results.line - 1).range
              vscode.window.activeTextEditor.selection = new vscode.Selection(range.start, range.end)
              vscode.window.activeTextEditor.revealRange(range, vscode.TextEditorRevealType.InCenter)
            })
          })
        }
      })
      return
    }

    setCurrentStory({ storyId: story.id, kind: section.kind, story: story.name })
  })

  function setCurrentStory(params: StorySelection) {
    const currentChannel = () => storybooksChannel
    currentKind = params.kind
    currentStory = params.story
    currentStoryId = params.storyId
    currentChannel().emit("setCurrentStory", params)
  }

  //when connecting to storybook, create a websocket connection
  //then pass it as an argument to the registerCallbacks function
  vscode.commands.registerCommand("extension.connectToStorybooks", () => {
    storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })
    registerCallbacks(storybooksChannel)
  })

  vscode.commands.registerCommand("extension.restartConnectionToStorybooks", () => {
    storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })
    registerCallbacks(storybooksChannel)
  })

  vscode.commands.registerCommand("extension.goToNextStorybook", () => {
    const stories = storyTreeViewProvider.stories
    const currentSection = stories.find(s => s.kind === currentKind)
    const currentStories = currentSection.stories
    const currentIndex = currentStories.map(e => e.id).indexOf(currentStoryId)
    if (currentIndex === currentStories.length) {
      // if you have reached the last story of an array of stories, enables the ability to wrap around
      vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[0])
    } else {

      vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentIndex + 1])
    }
  })

  vscode.commands.registerCommand("extension.goToPreviousStorybook", () => {
    const stories = storyTreeViewProvider.stories
    const currentSection = stories.find(s => s.kind === currentKind)
    const currentStories = currentSection.stories
    const currentIndex = currentStories.map(e => e.id).indexOf(currentStoryId)
    if (currentIndex === 0) {
      // if you have reached the last story of an array of stories, enables the ability to wrap around
      vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentStories.length - 1])
    } else {
      vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentIndex - 1])
    }
  })

  vscode.commands.registerCommand("extension.expandAllStories", () => {
    storyTreeViewProvider.expandAll()
  })

  vscode.commands.registerCommand("extension.collapseAllStories", () => {
    storyTreeViewProvider.collapseAll()
  })
}
*/
// Loop through all globbed stories,
// reading the files for the kind and the story name
// const findFileForStory = async (kind: string, story: string): Promise<{ uri: vscode.Uri; line: number } | null> => {
//   return new Promise<{ uri: vscode.Uri; line: number }>((resolve, reject) => {
//     //this regex is set as a glob expression in package.json that finds **.story.* files
//     const regex = vscode.workspace.getConfiguration("react-native-storybooks").get("storyRegex") as string

//     const root = vscode.workspace.workspaceFolders
//     vscode.workspace.findFiles(regex, "**/node_modules").then(files => {
//       let found = false
//       for (const file of files) {
//         const content = fs.readFileSync(file.fsPath, "utf8")
//         if (content.includes(kind) && content.includes(story)) {
//           const line = content.split(story)[0].split("\n").length
//           resolve({ uri: file, line })
//           found = true
//         }
//       }
//       if (!found) {
//         resolve(null)
//       }
//     })
//   })
// }

export function activate(context: vscode.ExtensionContext) {

	let PORT : number = vscode.workspace.getConfiguration("aesop").get("port");
	let host : string = vscode.workspace.getConfiguration("aesop").get("host");

	vscode.window.showInformationMessage(`Port set by default to ${PORT}`);

	//set context "aesop-awake" to true; enabling views
	vscode.commands.executeCommand("setContext", "aesop-awake", true);

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

				const statusText = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
				statusText.text = "Finding SB dependency..."
				statusText.color = "#FF8989";

				//check to see if a storybook node process is already running
				if (checkedProcesses === false){
					ps.lookup(
						{command: 'node',
						psargs: 'ux'
					}, (err, resultList) => {
						if (err){
							vscode.window.showErrorMessage(`Failed looking for running Node processes. Error: ${err}`);
							statusText.dispose();
						} else {
							//notify the user that Aesop is checking for a running Storybook instance
							statusText.text = `Reviewing processes...`;

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
									statusText.text = `Retrieving Storybook processs..`;

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
									}	else {
										statusText.text = `[Aesop] Checking your Storybook scripts in package.json...`;

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

										//older Windows systems support here: check platform and change process command accordingly
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
										const runSb = child_process.spawn(processCommand, ['run', 'storybook'], {cwd: rootDir, detached: true, env: process.env, windowsHide: true, windowsVerbatimArguments: true });

										statusText.text = `Done looking. Aesop will now run Storybook.`;

										runSb.stdout.setEncoding('utf8');

										let counter = 0;

										runSb.stdout.on('data', (data) => {
											let str = data.toString();
											let lines = str.split(" ");
											counter += 1;

											if (counter === 3) {
												const path = lines[171];
												const regExp = (/[^0-9]/g);
												PORT = parseInt(path.replace(regExp, ""));
											}

											let sbPortFlag = '-p';
											  if (lines.includes(sbPortFlag)){
											    const indexOfP = lines.indexOf(sbPortFlag);
											    vscode.window.showInformationMessage(`This is indexOfP: `, indexOfP);
											    if(indexOfP !== -1) {
											      PORT = parseInt(lines[indexOfP + 1]);
											      vscode.window.showInformationMessage(`storybook is now running on port: ${PORT}`);
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

	let openDisposable : vscode.Disposable = vscode.commands.registerCommand('extension.aesopChronicle', () => {

		const aesopWebview : vscode.Webview = {
			cspSource: null,
			html: aesopPreviewHTML,
			options: {
				enableCommandUris: true,
				enableScripts: true,
				portMapping: [{
					webviewPort: PORT,
					extensionHostPort: PORT,
				}],
				localResourceRoots: [vscode.Uri.file(context.extensionPath)]
			},
			// asWebviewUri(){};
			// onDidReceiveMessage(){};
			// postMessage() {}
		}

		const panel : vscode.WebviewPanel = {
			viewType: 'aesop-sb',
			active: true,
			options: {
				enableFindWidget: false,
				retainContextWhenHidden: true
			},
			title: 'Aesop',
			viewColumn: vscode.ViewColumn.Beside,
			visible: true,
			webview: aesopWebview,

			dispose(){},
			onDidChangeViewState(){},
			onDidDispose(){},
			reveal() {},
		}
	
		//here's where I need logic to fill html
		const aesopPreviewHTML : string = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Aesop</title>
			</head>
			<body>
				<iframe src="http://${host}:${PORT}/?path=/story/welcome--to-storybook></iframe>
			</body>
		</html>`
	});

	context.subscriptions.push(openDisposable);
}

export function deactivate() {
	// storybooksChannel.transport.socket.close()
}