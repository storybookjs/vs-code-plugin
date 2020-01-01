import * as vscode from 'vscode';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as ps from 'ps-node';

let PORT = 6006;
const host = 'localhost';

// import * as express from 'express';
// import { resolveCliPathFromVSCodeExecutablePath } from 'vscode-test';
// import createChannel from '@storybook/channel-websocket';
// import * as Websocket from 'ws';
// import { StoryTreeProvider, StoryObject, Story } from "./tree-provider";
// import { StoryPickerProvider, StorySelection } from "./picker-provider";
// const g = global as any;
// g.Websocket = Websocket;
// let storybookChannel : any;
// const connectedOnce : Boolean = false;

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
						//potential problem: we may also need to account for running processes given no port flag
						resultList.forEach((process) => {
							// vscode.window.showInformationMessage('JSON stringify', JSON.stringify(process));
							// fs.writeFile(path.join(rootDir, 'YOLO.txt'), JSON.stringify(process), (err) => console.log(`Couldn't yolo: ${err}`));
							// console.log(JSON.stringify(process));
							//check if any running processes are using the start-storybook script
							if(process.arguments[0].includes('storybook')){
								//stretch goal: check for multiple instances of storybook and reconcile
								vscode.window.showInformationMessage('PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments);
								//if so, extract port number and use that value to populate the webview with that contents
								const sbProcess = process.arguments;
								const portFlag = '-p';
								const pFlagIndex = sbProcess.indexOf(portFlag);
								if (pFlagIndex !== -1){
									PORT = Number(process.arguments[pFlagIndex+1]);
								};
							}
						});
					}
				});

				
        //if not, we begin a process that starts with extracting existing npm scripts and changing them:
        //check the existing storybook script in the package.json
        fs.readFile(path.join(rootDir, 'package.json'), (err, data) => {
          if (err) vscode.window.showErrorMessage(`Does this root folder contain a "package.json" file?`);
          else {
            //enter the package.JSON file and retrieve its contents as a string
            let packageJSONText = data.toString();

            //find where the "storybook" script is defined
            let targetScriptStartIndex = packageJSONText.indexOf(`"storybook":`)+12;

            //retrieve the value (i.e. the entire line of text) of the "storybook" script
						let retrievedScript = packageJSONText.slice(targetScriptStartIndex, packageJSONText.indexOf('\n'));
						vscode.window.showWarningMessage(retrievedScript);

            //iterate through that text string and parse out important flags
            //it is more helpful to split it into an array separated by whitespace to grab these
            let retrievedScriptAsArray = retrievedScript.split(' ');
            for (let i = 0; i < retrievedScriptAsArray.length; i++){
							//add flags
              if (retrievedScriptAsArray[i] === '-p'){
								PORT = Number(retrievedScriptAsArray[i+1]);
              };
            }

            //define the script text to execute to the virtual terminal instance
            const bootScript = `npm run storybook --ci`
						const bootStorybook = new vscode.ShellExecution(bootScript);

            //now create a virtual terminal and execute our special npm script for it
            //this first requires creating an eventEmitter that will fire that script
            const scriptEmitter = new vscode.EventEmitter<string>();
    
            //we also define a slave process Pseudoterminal (allowing Aesop to control the terminal)
            const pty: vscode.Pseudoterminal = {
              onDidWrite: scriptEmitter.event,
              open: () => bootStorybook,
              close: () => {},
              handleInput: data => scriptEmitter.fire(data === '\r' ? '\r\n' : data)
            };

            const virtualTerminal = vscode.window.createTerminal({name: 'sb-runner', pty});
					}
				})
			}
		})		

		//still inside our disposable variable, let's create the webview panel
		const panel : vscode.WebviewPanel = vscode.window.createWebviewPanel(
			'aesop-sb',
			'Aesop',
			vscode.ViewColumn.Three,
			{
				enableCommandUris: true,
				enableScripts: true,
				portMapping: [
					{ webviewPort: 6006, extensionHostPort: 9009}
				]
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
					<iframe src="http://${host}:${PORT}/?path=/story/welcome--to-storybook" style="height:500px;width:500px;"></iframe>
				</body>
			</html>`
		});

	context.subscriptions.push(disposable);
}

export function deactivate() {

}

// vscode.commands.executeCommand("setContext", "is-running-storybooks-vscode", true)

//   let previewUri = vscode.Uri.parse("storybook://authority/preview")
//   class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
//     public provideTextDocumentContent(uri: vscode.Uri): string {
//       const port = vscode.workspace.getConfiguration("react-native-storybooks").get("port")
//       const host = vscode.workspace.getConfiguration("react-native-storybooks").get("host")

//       return `
//             <style>iframe {
//                 position: fixed;
//                 border: none;
//                 top: 0; right: 0;
//                 bottom: 0; left: 0;
//                 width: 100%;
//                 height: 100%;
//             }
//             </style>

//             <body onload="iframe.document.head.appendChild(ifstyle)" style="background-color:red;margin:0px;padding:0px;overflow:hidden">
//                 <iframe src="http://${host}:${port}" frameborder="0"></iframe>
//                 <p>If you're seeing this, something is wrong :) (can't find server at ${host}:${port})</p>
//             </body>
//             `
//     }
//   }

//   let provider = new TextDocumentContentProvider()
//   let registration = vscode.workspace.registerTextDocumentContentProvider("storybook", provider)

//   const storiesProvider = new StoryTreeProvider()
//   vscode.window.registerTreeDataProvider("storybook", storiesProvider)

//   const pickerProvider = new StoryPickerProvider(storiesProvider)

//   // Registers the storyboards command to trigger a new HTML preview which hosts the storybook server
//   let disposable = vscode.commands.registerCommand("extension.showStorybookPreview", () => {
//     return vscode.commands.executeCommand("vscode.previewHtml", previewUri, vscode.ViewColumn.Two, "Storybooks").then(
//       success => {},
//       reason => {
//         vscode.window.showErrorMessage(reason)
//       }
//     )
//   })

//   context.subscriptions.push(disposable, registration)

//   const host = vscode.workspace.getConfiguration("react-native-storybooks").get("host")
//   const port = vscode.workspace.getConfiguration("react-native-storybooks").get("port")

//   storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })
//   var currentKind: string = null
//   var currentStory: string = null
//   var currentStoryId: string = null

//   // Create a statusbar item to reconnect, when we lose connection
//   const reconnectStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
//   reconnectStatusBarItem.command = "extension.restartConnectionToStorybooks"
//   if (connectedOnce) {
//     reconnectStatusBarItem.text = "Reconnect Storybooks"
//     reconnectStatusBarItem.color = "#FF8989"
//   } else {
//     reconnectStatusBarItem.text = "Connect to Storybooks"
//   }

//   reconnectStatusBarItem.hide()

//   // So when we re-connect, callbacks can happen on the new socket connection
//   const registerCallbacks = channel => {
//     // Called when we get stories from the RN client
//     channel.on("setStories", data => {
//       const filter = vscode.workspace.getConfiguration("react-native-storybooks").get("storybookFilterRegex") as string
//       const regex = new RegExp(filter)
//       let stories: Story[] = []
//       if (Array.isArray(data.stories)) {
//         let kinds: { [key: string]: StoryObj[] } = {}
//         const storydata = data.stories.filter(s => s.kind.match(regex))

//         storydata.map(story => {
//           story.stories.map(singleStory => {
//             if (kinds[story.kind] == undefined) {
//               // kinds[story.kind] = [story.name]
//               kinds[story.kind] = [{ name: singleStory, id: singleStory }]
//             } else {
//               kinds[story.kind].push({ name: singleStory, id: singleStory })
//             }
//           })
//         })
//         Object.keys(kinds).forEach(function(key) {
//           stories.push({
//             kind: key,
//             stories: kinds[key]
//           })
//         })
//       } else {
//         let kinds: { [key: string]: StoryObj[] } = {}
//         Object.keys(data.stories).forEach(function(key) {
//           const story = data.stories[key]
//           if (story.kind.match(regex)) {
//             if (kinds[story.kind] == undefined) {
//               // kinds[story.kind] = [story.name]
//               kinds[story.kind] = [{ name: story.name, id: story.id }]
//             } else {
//               kinds[story.kind].push({ name: story.name, id: story.id })
//             }
//           }
//         })
//         Object.keys(kinds).forEach(function(key) {
//           stories.push({
//             kind: key,
//             stories: kinds[key]
//           })
//         })
//       }
//       storiesProvider.stories = stories
//       storiesProvider.refresh()
//       reconnectStatusBarItem.hide()
//     })

//     // When the server in RN starts up, it asks what should be default
//     channel.on("getCurrentStory", () => {
//       storybooksChannel.emit("setCurrentStory", {
//         storyId: currentStoryId
//       })
//     })

//     // The React Native server has closed
//     channel.transport.socket.onclose = () => {
//       storiesProvider.stories = []
//       storiesProvider.refresh()
//       reconnectStatusBarItem.show()
//     }

//     channel.emit("getStories")
//   }
//   registerCallbacks(storybooksChannel)

//   vscode.commands.registerCommand("extension.searchStories", () => {
//     vscode.window.showQuickPick(pickerProvider.toList()).then((picked: string) => {
//       const setParams = pickerProvider.getParts(picked)
//       setCurrentStory(setParams)
//     })
//   })

//   // Allow clicking, and keep state on what is selected
//   vscode.commands.registerCommand("extension.openStory", (section, story) => {
//     // Handle a Double click
//     if (currentStoryId === story.id && currentKind === section.kind && currentStory === story.name) {
//       findFileForStory(section.kind, story.name).then(results => {
//         if (results) {
//           vscode.workspace.openTextDocument(results.uri).then(doc => {
//             vscode.window.showTextDocument(doc).then(shownDoc => {
//               let range = doc.lineAt(results.line - 1).range
//               vscode.window.activeTextEditor.selection = new vscode.Selection(range.start, range.end)
//               vscode.window.activeTextEditor.revealRange(range, vscode.TextEditorRevealType.InCenter)
//             })
//           })
//         }
//       })
//       return
//     }

//     setCurrentStory({ storyId: story.id, kind: section.kind, story: story.name })
//   })

//   function setCurrentStory(params: StorySelection) {
//     const currentChannel = () => storybooksChannel
//     currentKind = params.kind
//     currentStory = params.story
//     currentStoryId = params.storyId
//     currentChannel().emit("setCurrentStory", params)
//   }

//   vscode.commands.registerCommand("extension.connectToStorybooks", () => {
//     storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })
//     registerCallbacks(storybooksChannel)
//   })

//   vscode.commands.registerCommand("extension.restartConnectionToStorybooks", () => {
//     storybooksChannel = createChannel({ url: `ws://${host}:${port}`, async: true, onError: () => {} })
//     registerCallbacks(storybooksChannel)
//   })

//   // These are a bit alpha-y, as I don't think I can control what is showing as selected inside the VS Code UI
//   vscode.commands.registerCommand("extension.goToNextStorybook", () => {
//     const stories = storiesProvider.stories
//     const currentSection = stories.find(s => s.kind === currentKind)
//     const currentStories = currentSection.stories
//     const currentIndex = currentStories.map(e => e.id).indexOf(currentStoryId)
//     if (currentIndex === currentStories.length) {
//       // go around or something
//       vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[0])
//     } else {
//       vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentIndex + 1])
//     }
//   })

//   vscode.commands.registerCommand("extension.goToPreviousStorybook", () => {
//     const stories = storiesProvider.stories
//     const currentSection = stories.find(s => s.kind === currentKind)
//     const currentStories = currentSection.stories
//     const currentIndex = currentStories.map(e => e.id).indexOf(currentStoryId)
//     if (currentIndex === 0) {
//       // go around or something
//       vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentStories.length - 1])
//     } else {
//       vscode.commands.executeCommand("extension.openStory", currentSection, currentStories[currentIndex - 1])
//     }
//   })

//   vscode.commands.registerCommand("extension.expandAllStories", () => {
//     storiesProvider.expandAll()
//   })

//   vscode.commands.registerCommand("extension.collapseAllStories", () => {
//     storiesProvider.collapseAll()
//   })
// }

// // Loop through all globbed stories,
// // reading the files for the kind and the story name

// const findFileForStory = async (kind: string, story: string): Promise<{ uri: vscode.Uri; line: number } | null> => {
//   return new Promise<{ uri: vscode.Uri; line: number }>((resolve, reject) => {
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

// export function deactivate() {
//   storybooksChannel.transport.socket.close()
// }

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