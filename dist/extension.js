module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/extension.ts":
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(/*! vscode */ "vscode");
//port should be variable to listen for action in the user's active terminal
// const PORT = 6006;
// const server = express();
function activate(context) {
    // server.get('/', (req, res) => {
    // 	vscode.window.showInformationMessage('Aesop server online');
    // 	res.end();
    // });
    // server.listen(PORT);
    //create disposable variable type, registers awaken command & opens webview
    let disposable = vscode.commands.registerCommand('extension.aesopAwaken', () => {
        // //declare an empty array (of strings) to push our scripts to during the next part
        // const scriptArray : Array<string> = [];
        // //define a path to the root working directory of the user
        // const rootDir = fileURLToPath(vscode.workspace.workspaceFolders[0].uri.toString(true));
        // //now let's read SB's outputted index.html file, and parse out what we need
        // fs.readFile(path.join(rootDir, '/node_modules/@storybook/core/dist/public/index.html'), (err, data) => {
        // 	if (err) console.error(err);
        // 	else {
        // 		//if we've read the HTML file, take its contents and stringify it
        // 		let outputFile = data.toString();
        // 		// this log shows what our eventual permutations would look like as we carve out the scripts
        // 		// vscode.window.showWarningMessage(`what's in it: ${outputFile.slice(outputFile.indexOf('<body>')+6, outputFile.indexOf('</body>'))} \n`)
        // 		//split out the body section of the retrieved html file
        // 		outputFile = outputFile.slice(outputFile.indexOf('<body>')+6, outputFile.indexOf('</body>'));
        // 		vscode.window.showWarningMessage(`${outputFile} \n`)
        // 		//this loop will peel out all the scripts so long as there are any to rip out
        // 		while (outputFile.includes(`"<script src=`)){
        // 			//we push just what we need (the src attributes), leaving the <script>...</script> tags behind
        // 			let temp = outputFile.slice(outputFile.indexOf(`<script src="`)+12, outputFile.indexOf(`"></script>`));
        // 			scriptArray.push(temp);
        // 			outputFile = outputFile.slice(outputFile.indexOf(`"></script>`)+10);
        // 		}
        // 	};
        // });
        //still inside our disposable variable, let's create the webview panel
        const panel = vscode.window.createWebviewPanel('aesop-sb', 'Aesop', vscode.ViewColumn.Three, {
            enableCommandUris: true,
            enableScripts: true,
        });
        //errors to tackle
        //creates the webview
        //displays output file body segment
        // to-do:
        // figure out how to iteratively call sb scripts within our webview
        // webview messages / scripts to reload
        // figure out how to use a tsx rule in webpack to execute scripts
        // signal babel to interpret this block as tsx, e.g. something like: //@tsx babel//
        panel.webview.html =
            `<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Aesop</title>
				</head>
				<body>
					<iframe src="http://localhost:6006/?path=/story/welcome--to-storybook" style="width:500px; height:500px">
					</iframe>
				</body>
			</html>`;
        context.subscriptions.push(disposable);
    });
    // <div id="root"></div>
    // <div id="docs-root"></div>	
    // 	<div id="scriptExecute">
    // 	<script>window.acquireVsCodeApi = acquireVsCodeApi();</script>
    // 	<script>window['DOCS_MODE'] = false;</script>
    // 	<script>
    // 		${
    // 			scriptArray.map( (el) => {
    // 				if (el.includes("./sb_dll")){
    // 					let uiScript = document.createElement("script");
    // 					uiScript.async = true;
    // 					uiScript.defer = true;
    // 					uiScript.referrerPolicy = "origin";
    // 					uiScript.src = path.join(rootDir, `/node_modules/@storybook/core/dll/${el}`);
    // 					document.getElementById("scriptExecute").appendChild(uiScript);
    // 				}	else {
    // 					let capturedScript = document.createElement("script");
    // 					capturedScript.async = true;
    // 					capturedScript.defer = true;
    // 					capturedScript.referrerPolicy = "origin";
    // 					capturedScript.src = path.join(rootDir, `/node_modules/@storybook/core/dist/public/${el}`);
    // 					document.getElementById("scriptExecute").appendChild(capturedScript);
    // 				}
    // 			})
    // 		}
    // 	</script>
    // </div>
    // disposable = vscode.commands.registerCommand('extension.getStories', () => {
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
    // });
    // context.subscriptions.push(disposable);
}
exports.activate = activate;
;
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ })

/******/ });
//# sourceMappingURL=extension.js.map