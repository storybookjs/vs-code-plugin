import * as fs from "fs";
import * as path from 'path';
import logger from './logger'
import * as util from 'util';
import * as ps from 'ps-node';

//create interfaces for each checker function
//should look like:
//checkDto: Object {
//status: boolean;
//payload: any;
//}

class StorybookChecker {
    rootDir: string;
    vscode: any;
    constructor(rootDir: string, vscode) {
        this.rootDir = rootDir;
        this.vscode = vscode;
        logger.open(rootDir);
    }
    //check if Storybook is a dependency
    dependency(): object {
        try {
            fs.accessSync(path.join(this.rootDir, '/node_modules/@storybook'));
            logger.write('Aesop has found a Storybook dependency');
            return {
                status: true,
                payload: null
            }
        } catch (error) {
            logger.write('Error finding storybook dependency');
            this.vscode.window.showErrorMessage(`Aesop could not find Storybook as a dependency in the active folder, ${this.rootDir}`);
            throw new Error('Error finding a storybook project');
            return {
                status: false,
                payload: null
            }
        }
    }


    //should I separate the nodeProc checks into the process service?
    //if I do, I can decouple vscode from this class and turn it into a function instead

    async nodeProc(): Promise<object> {
        const psLookup = util.promisify(ps.lookup);

        try {
            const resultList: [] = await psLookup({ command: 'node', psargs: 'ux' });
            return {
                status: true,
                payload: resultList
            }
        } catch (error) {
            const errMsg = `Error looking up processes: ${error}`
            logger.write(errMsg);
            throw new Error(errMsg);
            return {
                status: false,
                payload: null
            }
        }
    }

    storyBookProc(resultList: []): object {
        for (let i = 0; i < resultList.length; i++) {
            let process = resultList[i];
            if (process.arguments[0].includes('node_modules') && process.arguments[0].includes('storybook')) {
                return {
                    status: true,
                    payload: process
                }
            }
        }
        return {
            status: false,
            payload: null
        }
    }




    //SEPARATE INTO SERVICES


}

//                     //if no processes matched 'storybook', we will have to spin up the storybook server
//                     if (foundSb === false) {

//                         fs.readFile(path.join(rootDir, 'package.json'), (err, data) => {
//                             if (err) {
//                                 vscode.window.showErrorMessage(`Aesop is attempting to read ${rootDir}. Is there a package.json file here?`);
//                                 statusText.dispose();
//                             } else {
//                                 statusText.text = `Checking package.json...`;

//                                 //enter the package.JSON file and retrieve its contents as an object
//                                 let packageJSON = JSON.parse(data.toString());
//                                 let storybookScript = packageJSON.scripts.storybook;

//                                 //iterate through the text string (stored on "storybook" key) and parse out port flag
//                                 //it is more helpful to split it into an array separated by whitespace to grab this
//                                 let retrievedScriptArray = storybookScript.split(' ');

//                                 //@TODO if script already includes --ci, no need to add it

//                                 //older Windows systems support here: check platform, change process command accordingly
//                                 let platform: NodeJS.Platform = os.platform();

//                                 const sbCLI = './node_modules/.bin/start-storybook'
//                                 const sbStartIndex = retrievedScriptArray.indexOf('start-storybook')
//                                 retrievedScriptArray[sbStartIndex] = sbCLI;
//                                 retrievedScriptArray.push('--ci')

//                                 //now launch the child process on the port you've derived
//                                 const childProcessArguments = (platform === 'win32') ? ['run', 'storybook'] : retrievedScriptArray;
//                                 const childProcessCommand = (platform === 'win32') ? 'npm.cmd' : 'node';

//                                 const runSb = child_process.spawn(childProcessCommand, childProcessArguments, { cwd: rootDir, detached: true, env: process.env, windowsHide: false, windowsVerbatimArguments: true });

//                                 // if (platform === 'win32') {
//                                 // 	let runSb = child_process.spawn('npm.cmd', ['run', 'storybook'], {cwd: rootDir, detached: true, env: process.env, windowsHide: false, windowsVerbatimArguments: true });
//                                 // } else {
//                                 // 	let runSb =	child_process.spawn('node', retrievedScriptArray, {cwd: rootDir, detached: false, env: process.env });
//                                 // }

//                                 statusText.text = `Done looking. Aesop will now launch Storybook in the background.`;

//                                 runSb.stdout.setEncoding('utf8');

//                                 let counter = 0;

//                                 //Storybook outputs three messages to the terminal as it spins up
//                                 //grab the port from the last message to listen in on the process

//                                 runSb.stdout.on('data', (data) => {
//                                     if (emittedAesop === true) return;
//                                     let str = data.toString().split(" ");
//                                     counter += 1;

//                                     if (counter >= 2) {
//                                         for (let i = 165; i < str.length; i += 1) {
//                                             if (str[i].includes('localhost')) {
//                                                 const path = str[i];
//                                                 const regExp = (/[^0-9]/g);
//                                                 PORT = (path.replace(regExp, ""));
//                                                 emittedAesop = true;
//                                                 aesopEmitter.emit('sb_on');
//                                                 return;
//                                             }
//                                         }
//                                     }
//                                 })

//                                 runSb.on('error', (err) => {
//                                     console.log(err);
//                                     process.exit(1);
//                                 })

//                                 //make sure the child process is terminated on process exit
//                                 runSb.on('exit', (code) => {
//                                     console.log(`child process exited with code ${code}`);
//                                 })
//                             }
//                         })
//                     } //close spin up server
//                 }; //CLOSE else psLookup
//             }); //close ps LOOKUP //close depend found, not checked processes
//     }//close else statement in fs.access
// }) //close fs access









export default StorybookChecker;