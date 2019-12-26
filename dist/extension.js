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
const url_1 = __webpack_require__(/*! url */ "url");
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
        const panel = vscode.window.createWebviewPanel('aesop-sb', 'Aesop', vscode.ViewColumn.Three, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(context.extensionPath)]
        });
        panel.webview.html = `<!DOCTYPE html>
		<html lang="en">
		<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Aesop</title>
		<style>
		html { width: 100%; height: 100%; min-width: 20%; min-height: 20%;}
		body { display: flex; flex-flow: column nowrap; padding: 0; margin: 0; width: 100%' justify-content: center}
		iframe { border: none; background: blue; min-width: 50%; max-height: 80%; vertical-align: center;}
		</style>
		</head>
		<body>
		<iframe src="http://google.com"></iframe>
		<br/>
		<span>Let's put some content here</span>
		</body>
		</html>`;
        vscode.window.showInformationMessage(`Aesop is ready to chronicle your stories!`);
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
        console.log(vscode.Uri.file(url_1.fileURLToPath(`/node_modules/@storybook/core/dist/public`)));
        //define a path to SB webpack bundle outputs (in user workspace /node_modules/ folder)
        const distGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "**/node_modules/@storybook/core/dist/public");
        //instantiate a watcher to listen for fs path changes (e.g. file creation/update)
        //bools = options for ignoreCreateEvents?, ignoreChangeEvents?, ignoreDeleteEvents?
        // observer.onDidChange = /*resolve*/;		// observer.onDidCreate = /*resolve*/;
        const observer = vscode.workspace.createFileSystemWatcher(distGlob, false, false, false);
        //extract index.html file that outputs into SB's preview pane
        const htmlGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "*/node_modules/@storybook/core/dist/public/*.html");
        //extract necessary bundle scripts to leverage in-app dependencies
        const scriptGlob = new vscode.RelativePattern(vscode.workspace.workspaceFolders[0], "*/node_modules/@storybook/core/dist/public/*.js");
        //do we need to resolve the Storybook UI script from the /dll/ folder?
        //if extract methods above fail, determine logic to parse out HTML/.js scripts (index 0?);
        //retrieve files with findFiles/relativeFilePath
        const arrayOfScripts = vscode.workspace.findFiles(distGlob, null, 100);
        //dev check: have we successfully pulled down script files?
        //if so, should we then store them locally, or is there no point?
        if (arrayOfScripts !== undefined) {
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
        console.log(`
		rootPath: ${vscode.workspace.workspaceFolders[0]},
		vscode.Uri: ${vscode.Uri},
		workspace: ${vscode.workspace},
		distGlob: ${distGlob.toString()},
		htmlGlob: ${htmlGlob.toString()},
		scriptGlob: ${scriptGlob.toString()}
		`);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

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