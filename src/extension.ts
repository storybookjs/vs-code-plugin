import * as vscode from 'vscode';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as ps from 'ps-node';
import { spawn } from 'child_process';
import * as events from 'events';
import * as os from 'os';

export function activate(context: vscode.ExtensionContext) {
	// let panel : vscode.WebviewPanel | undefined = undefined;
	//define PORT and host variables to feed the webview content from SB server
	// var PORT : number;
	// let host : string = 'localhost';
	const aesopEmitter = new events.EventEmitter();
	// let emittedAesop = false;

	const platform = os.platform();
	const commands = {
		linux: {
			cmd: 'netstat',
			args: ['-apntu'],
		},
		darwin: {
			cmd: 'netstat',
			args: ['-v', '-n', '-p', 'tcp'],
		},
		win32: {
			cmd: 'netstat.exe',
			args: ['-a', '-n', '-o'],
		},
	};
		
	const command = commands[platform];
	//@TODO: if aesop already opened sb in webview - subsequent calls to aesop should not open a new webview

  //define a path to the user's root working directory
  const rootDir = fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));
  const debugLog = path.resolve(rootDir, './vscode.message-log.txt');

	// set context "aesop-awake" to true; enabling views
	vscode.commands.executeCommand("setContext", "aesop-awake", true);

	//create the status bar to let the user know what Aesop is doing
	const statusText = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 7);
	statusText.text = "Aesop is finding your Storybook dependency..."
	statusText.color = "#FFFFFF";
	statusText.command = undefined;
	statusText.tooltip = "Aesop for Storybook status";
  
  // retainContextWhenHidden has a high memory overhead;
  // JSON serial objects can be used to reinstantiate state
  // w/getState() and setState() methods, but for our needs?

  function createAesop(PORT : number) {
    statusText.hide();
    vscode.window.showInformationMessage(`Welcome to Aesop Storybook`);
    let panel = vscode.window.createWebviewPanel(
      'aesop-sb',
      'Aesop',
      vscode.ViewColumn.Beside,
      {
        enableCommandUris: true,
        enableScripts: true,
        portMapping: [{
          webviewPort: PORT,
          extensionHostPort: PORT
        }],
        localResourceRoots: [vscode.Uri.file(context.extensionPath)],
        retainContextWhenHidden: true
      }
    );

    panel.webview.onDidReceiveMessage((e) => {
      console.log('Webview received:', e);
      fs.appendFileSync(debugLog, `Webview panel recieved this from ${e.source}/${e.origin}: \n\n ${e} \n\n*** End log. *** \n\n`);
    });

    panel.onDidDispose(
      (e) => {
        panel = undefined;
      },
      undefined,
      context.subscriptions
    );

    panel.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${panel.webview.cspSource} https:; script-src ${panel.webview.cspSource} http: https: 'unsafe-inline'; style-src ${panel.webview.cspSource} http: https: 'unsafe-inline'; frame-src http: https: 'unsafe-inline';"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Aesop</title>
        <style>
          html { width: 100%; height: 100%; min-width: 20%; min-height: 20%;}
          body { display: flex; flex-flow: column nowrap; padding: 0; margin: 0; width: 100%;  height: 100%; justify-content: center}
        </style>
      </head>
      <body>
        <iframe id="sb_iFrame" src="http://localhost:${PORT}" width="100%" height="100%" sandbox="allow-scripts allow-same-origin allow-top-navigation">
          <script>
            const vscode = acquireVsCodeApi();
            console.log('Hello from iframe nested script.');
            if (window) {
              if (window.contentWindow) {
                window.contentWindow.on('message', (e) => {
                  vscode.postMessage(e);
                })
              }
            }

            if (window.addEventListener) {
              console.log("Window - inner script: ");
              console.log(window);
              console.log("Window TOP - inner script: ");
              console.log(window.top);
              console.log("Window PARENT - inner script: ");
              console.log(window.parent);
              window.addEventListener('load', handleLoad, false);
              window.addEventListener('message', listenToStorybook, false);
            }      
            
            if (parent) {
              parent.postMessage(JSON.stringify({ iframe: 'sb_iFrame talking to body'}));
            }
          </script>
		</iframe>
		<script>
		if (globals) {
			console.log('Globals is:');
			console.log(globals);
		}
		</script>
      </body>
    </html>`
  }; //close createAesopHelper

  aesopEmitter.on('sb_on', (...args) => {
    const storybookPort = args[0];
    fs.appendFileSync(debugLog, `\n.\n Aesop emitter received arguments: \n ${args} \n Aesop emitter port ${storybookPort} \n\n*** End log. ***\n\n`);
    createAesop(storybookPort);
  });

  // this helper function dynamically retrieves the Storybook server's port with netstat
  const retrievePort = (processPid) => {

    let dynamicPort : number;
    const netStatProcess = spawn(command.cmd, command.args);
    const grepProcess = spawn('grep', [processPid]);

    netStatProcess.stdout.pipe(grepProcess.stdin);
    grepProcess.stdout.setEncoding('utf8');
    
    grepProcess.stdout.on('data', (data) => {
      const parts = data.split(/\s/).filter(String);
      const partIndex = (platform === 'win32') ? 1 : 3;
      dynamicPort = parseInt(parts[partIndex].replace(/[^0-9]/g, ''));
      fs.appendFileSync(debugLog, `\n*** GREP RECEIVED THE FOLLOWING DATA: ***\n${data}\n Parsed data chunks:\n ${parts}\n Derived port is ${dynamicPort}\n\n`);
      netStatProcess.kill();
    });

    // cascade child process kills to ensure no extant processes
    netStatProcess.stdout.on('close', (code = 1) => {
      console.log(`Netstat killed: ${code}`);
      grepProcess.kill();
    });
    
    grepProcess.stdout.on('close', (code = 1) => {
      console.log(`Grep killed: ${code}`);
      fs.appendFileSync(debugLog, `NetStat killed? ${netStatProcess.killed}\n Grep emitting ${dynamicPort} to AesopEmitter`);
      aesopEmitter.emit('sb_on', dynamicPort);
    });
  };

	//create disposable to register Aesop Awaken command to subscriptions
	let disposable : vscode.Disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {
  
    // display status text in bottom panel as Aesop initializes
		statusText.show();

		// declare variable to toggle whether running Storybook process was found
		let foundSb : Boolean = false;

		// first test whether Storybook has been depended into your application
		fs.access(path.join(rootDir, '/node_modules/@storybook'), (err) => {

			//if the filepath isn't found, show the user what Aesop is reading as the root path
			if (err) {
				vscode.window.showErrorMessage(`Aesop could not find Storybook as a dependency in the active folder, ${rootDir}`);
				throw new Error('Error finding a storybook project');
			}	else {
				statusText.text = "Aesop found a Storybook project."

				// check to see if a Storybook process is already running
				ps.lookup ({
					command: 'node',
					psargs: 'ux'
				}, (err : Error, resultList : any) => {
          			// 'any' type not ideal, but ps utility doesn't play nice with strict NodeJsProcess types
					if (err){
						vscode.window.showErrorMessage(`Failed looking for running Node processes. Error: ${err}`);
						statusText.dispose();
						throw new Error('Failed looking for running Node processes.');	
					} else {
						//notify the user that Aesop is checking for a running Storybook instances
						statusText.text = `Reviewing Node processes...`;

						fs.appendFileSync(debugLog, `\nRunning Node processes detailed here:\n`);

						// if the process lookup was able to find running processes, iterate through to review them
						// this should be typed as a NodeJS.process, but pslookup returns a standard object; use 'any'
						resultList.forEach((nodeProcess : any) => {
			
							fs.appendFileSync(debugLog, `PID ${nodeProcess.pid} arguments:\n${nodeProcess.arguments}\n`);

							// check if any running processes are Storybook processes
							// @TODO: (stretch feature) check for multiple instances of storybook and reconcile
							if (nodeProcess.arguments[0].includes('node_modules') && nodeProcess.arguments[0].includes('storybook')) {
								statusText.text = `Retrieving running Storybook process...`;
								// set toggle to true to prevent running another process below
								foundSb = true;
								
								// grab the PID to use in the netstat process
								const processPid = parseInt(nodeProcess['pid']).toString();

								fs.appendFileSync(debugLog, `\n*** FOUND STORYBOOK INSTANCE ***\nARGUMENTS: ${nodeProcess.arguments}\nPARSED PID: ${processPid}\n *** CONT'D *** \n`);
								retrievePort(processPid);
							} //---> close if process.arguments[0] contains storybook			
						}); //---> close resultList.forEach()


						// if no processes matched 'Storybook', spin up the Storybook server
						if (foundSb === false) {
							fs.appendFileSync(debugLog, `\nDid not find a running Storybook server. Starting one.\n`);

							fs.readFile(path.join(rootDir, 'package.json'), (err, data) => {
								if (err){
									vscode.window.showErrorMessage(`Aesop is attempting to read ${rootDir}. Is there a package.json file here?`);
									statusText.dispose();
								} else {
									statusText.text = `Checking package.json...`;

									// enter the package.JSON file and retrieve its contents as an object
									let packageJSON = JSON.parse(data.toString());

									// retrieve the storybook script with any additional flags (e.g. ports, etc.)
									let storybookScript = packageJSON.scripts.storybook;
										
									// split the arguments into an arguments array for use in the child process
									let retrievedScriptArray = storybookScript.split(' ');

									// check platform, change process command accordingly (older Windows systems support)
									// @TODO if script already includes --ci, no need to add it
									let platform = os.platform();
									const sbCLI = './node_modules/.bin/start-storybook';
									const sbStartIndex = retrievedScriptArray.indexOf('start-storybook');
									retrievedScriptArray[sbStartIndex] = sbCLI;
									retrievedScriptArray.push('--ci');

									fs.appendFileSync(debugLog, `\nRetrieved package.json script: ${retrievedScriptArray}\n`);

									// now launch Storybook as a child process
									const childProcessArguments = (platform === 'win32') ? ['run', 'storybook'] : retrievedScriptArray;
									const childProcessCommand = (platform === 'win32') ? 'npm.cmd' : 'node';
									
									statusText.text = `Done looking. Aesop will now launch Storybook in the background.`;
									
									fs.appendFileSync(debugLog, `Running storybook with command:\n ${childProcessCommand}\n and arguments: ${childProcessArguments}\n`);

									const runSb = spawn(childProcessCommand, childProcessArguments, {
										cwd: rootDir,
										detached: true,
										env: process.env,
										windowsHide: false,
										windowsVerbatimArguments: true 
									});

									// runSb.stdout.setEncoding('utf8');
									// runSb.unref();
						
									let counter = 0;

									// runSb.stdout.pipe(process.stdout, {end: false});
									// process.stdin.resume();
									// process.stdin.pipe(runSb.stdin, {end: false});

									// process.stdout.on('data', (data) => {
									//   fs.appendFileSync(debugLog, `Process received ${data}\n.\n.***End log***\n.\n.`);
									// })

									// Storybook outputs three messages to the terminal as it spins up
									// grab the port from the last message to listen in on the process
									runSb.stdout.on('data', (data) => {
										
										fs.appendFileSync(debugLog, `@runSb.stdout.on('data'), Counter is ${counter}. Data is ${data}\n.\n.***End log***\n.\n.`);
										vscode.window.showInformationMessage(data);
										let str = data.toString().split(" ");
										counter +=1;

										if (counter >= 2) {
											for (let i = 100; i < str.length; i += 1) {

												/* Aesop debug logging */
												fs.appendFileSync(debugLog, `@runSb.stdout.on('data') FOR LOOP, counter is ${counter} \n\n***End log***\n\n`);
												
												if (str[i].includes('localhost')) {
													/* Aesop debug logging */
													fs.appendFileSync(debugLog, `@runSb.stdout.on('data') - sSTR[I] IS: ${str[i]}`);
													let foundPort = parseInt(str[i].match(/[^0-9]/g));
													fs.appendFileSync(debugLog, `@runSb.stdout.on('data') - str[i] includes, counter is ${counter} with found port: ${foundPort}`);
							
													aesopEmitter.emit('sb_on', foundPort);
												}
											}
										}
									});

									/* THIS LOGIC IS FLAWED; 'RUN STORYBOOK' COMMAND HAS A SUB-PROCESS */
									runSb.on('close', () => {
										fs.appendFileSync(debugLog, `Storybook process ended.`);
										console.log('Storybook process ended.');
										retrievePort(runSb.pid);
									});

									runSb.on('error', (err) => {
										fs.appendFileSync(debugLog, `Error starting Storybook: ${err}`);
										process.exit(1);
									});

									//make sure the child process is terminated on process exit
									runSb.on('exit', (code) => {
										console.log(`Storybook child process exited with code ${code}`);
									});
								} // close fs.readFile(package.json) else statement
							}) //close fs.readFile(package.json)
						} //close spin up server if no found process matches
					}; //CLOSE ps.lookup() else statement
				}); //close ps.lookup()
			} //close fs.access() else statement
		}) //close fs.access()
	}); //close disposable

  context.subscriptions.push(disposable);
}

export function deactivate() {
	process.exit();
}
