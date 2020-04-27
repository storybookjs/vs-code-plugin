import * as child_process from 'child_process';
import * as fs from "fs";
import * as path from 'path';
import commands from './commands';
import logger from '../utils/logger'


const { command, platform } = commands;

class ProcessService {
    public port: number;
    private rootDir: string;
    private fileName: string;
    private vscode;
    private aesopEmitter;
    constructor({ rootDir, vscode, aesopEmitter }) {
        this.rootDir = rootDir;
        this.vscode = vscode;
        this.aesopEmitter = aesopEmitter;
        this.fileName = '@process.service.ts'
        this.startStorybook = this.startStorybook.bind(this);
        this.findLocation = this.findLocation.bind(this);
        this.locationViaNetStat = this.locationViaNetStat.bind(this);
    }


    //Provides process id to locationViaNetstat helper
    public findLocation(pid) {
        logger.write('Attempting to find Storybook Location', this.fileName, 'findLocation')
        const processPid = parseInt(pid).toString();
        this.locationViaNetStat(processPid);
    }

    /* Spins up two child processes, searching through list of all active network processes for specified process ID
        and extracting the local port in which that process is currently being served to */
    private locationViaNetStat(processPid) {
        logger.write('Attempting to locate via Netstat', this.fileName, 'locationViaNetstat')
        const netStatProcess = child_process.spawnSync(command.cmd, command.args);
        logger.write(`Finished netStat process : ${netStatProcess.stdout}`, this.fileName, 'locationViaNetstat')
        const grepProcess = child_process.spawnSync('grep', [processPid], { input: netStatProcess.stdout, encoding: 'utf8' });
        logger.write(`Finished grep process : ${grepProcess.stdout.toString()}`, this.fileName, 'locationViaNetstat')

        this.port = this.netstatPortHelper(grepProcess)

        this.aesopEmitter.emit('create_webview', this.port);
        logger.write(`Found Storybook location via Netstat`, this.fileName, 'locationViaNetstat/grepProcess');

    }

    //Extracts Port from netstat/grep process stdout
    private netstatPortHelper({ stdout }): number {
        const parts = stdout.split(/\s/).filter(String);
        const partIndex = (platform === 'win32') ? 1 : 3;
        const port = parseInt(parts[partIndex].replace(/[^0-9]/g, ''));
        return port
    }

    //Attempts to start storybook for you
    public startStorybook() {
        logger.write('Starting Storybook for you!', this.fileName, 'startStorybook')

        const { childProcessArguments, childProcessCommand } = (platform === 'win32') ? this.createSbWinConfig() : this.createSbConfig();
        const runSb = child_process.spawn(childProcessCommand, childProcessArguments, { cwd: this.rootDir, detached: true, env: process.env, windowsHide: false, windowsVerbatimArguments: true });
        runSb.stdout.setEncoding('utf8');

        let counter = 0;

        //Storybook outputs three messages to the terminal as it spins up
        //grab the port from the last message to listen in on the process

        let callback = (data) => {
            let str = data.toString().split(" ");
            counter += 1;
            logger.write(`This is data: ${data.toString()}`, this.fileName, 'startStorybook/runSb')

            if (counter >= 2) {
                for (let i = 165; i < str.length; i += 1) {
                    if (str[i].includes('localhost')) {
                        const path = str[i];
                        const regExp = (/[^0-9]/g);
                        this.port = (path.replace(regExp, ""));

                        logger.write('Found instance in stdout that includes localhost', this.fileName, 'startStorybook/runSb')
                        this.aesopEmitter.emit('create_webview', this.port);
                        return true;
                    }
                }
            }
        };
        callback = callback.bind(this);


        runSb.stdout.on('data', callback)

        runSb.on('error', (err) => {
            console.log(err);
            process.exit(1);
        })

        runSb.on('exit', (code) => {
            console.log(`child process exited with code ${code}`);
        })
    }

    //creates shell commands to spin up storybook, depending on your platform
    private createSbWinConfig() {
        const config = {
            childProcessArguments: ['run', 'storybook'],
            childProcessCommand: 'npm.cmd'
        }
        return config;
    }

    private createSbConfig() {
        const config = {
            childProcessArguments: [],
            childProcessCommand: ''
        }

        //older Windows systems support here: check platform, change process command accordingly
        const retrievedScriptArray = this.obtainSbScript();

        const sbCLI = './node_modules/.bin/start-storybook'
        const sbStartIndex = retrievedScriptArray.indexOf('start-storybook')
        retrievedScriptArray[sbStartIndex] = sbCLI;
        retrievedScriptArray.push('--ci')

        //launch storybook using a child process
        config.childProcessArguments = retrievedScriptArray;
        config.childProcessCommand = 'node';

        return config;
    }

    private obtainSbScript() {
        let configData: Buffer;

        try {
            configData = fs.readFileSync(path.join(this.rootDir, 'package.json'));
            logger.write('Obtained data from package.json', this.fileName, 'startStorybook');
        } catch (err) {
            this.vscode.window.showErrorMessage(`Aesop is attempting to read ${this.rootDir}. Is there a package.json file here?`);
            return false;
        }

        //check if the user has custom configurations for starting storybook

        const packageJSON = JSON.parse(configData.toString());
        const storybookScript = packageJSON.scripts.storybook;
        const retrievedScriptArray = storybookScript.split(' ');
        return retrievedScriptArray
    }
}


export default ProcessService;
