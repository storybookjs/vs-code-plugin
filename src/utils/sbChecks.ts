import * as fs from "fs";
import * as path from 'path';
import logger from './logger'
import * as util from 'util';
import * as ps from 'ps-node';


class StorybookChecker {
    rootDir: string;
    vscode: any;
    aesopEmitter: any;
    private fileName : string;
    constructor({ rootDir, vscode, aesopEmitter }) {
        this.rootDir = rootDir;
        this.vscode = vscode;
        this.aesopEmitter = aesopEmitter;
        logger.open(rootDir);
        this.fileName = 'sbChecks.ts'
        this.nodeProc = this.nodeProc.bind(this);
        this.storyBookProc = this.storyBookProc.bind(this);
    }
    //check if Storybook is a dependency
    dependency(): void {

        try {
            fs.accessSync(path.join(this.rootDir, '/node_modules/@storybook'));
            logger.write('Aesop has found a Storybook dependency', this.fileName, 'dependency');
            this.aesopEmitter.emit('found_dependency')

        } catch (error) {
            logger.write('Error finding storybook dependency', this.fileName,'dependency');
            this.vscode.window.showErrorMessage(`Aesop could not find Storybook as a dependency in the active folder, ${this.rootDir}`);
            throw new Error('Error finding a storybook project');
        }
    }


    //should I separate the nodeProc checks into the process service?
    //if I do, I can decouple vscode from this class and turn it into a function instead

    //this is where I'm currently getting errors.

    nodeProc() {
        // const psLookup = util.promisify(ps.lookup);
        logger.write('Looking for node processes!', this.fileName, 'nodeProc')
        let callback = (err, resultList) => {
            if (err) return this.aesopEmitter('error', err);
            logger.write(`Found node processes!`, this.fileName, 'nodeProc');
            this.aesopEmitter.emit('found_nodeps', resultList)
        }
        callback = callback.bind(this);

        ps.lookup({ command: 'node', psargs: 'ux' }, callback);
        

    }

    //can definitely optimize
    storyBookProc(resultList: []): void {
        logger.write('Looking for Storybook Process!', this.fileName, 'storyBookProc')
        let process: string;
        for (let i = 0; i < resultList.length; i++) {
            process = resultList[i]['arguments'][0];
            //OPTIMIZE THIS
            if (process.includes('node_modules') && process.includes('storybook')) {
                const { pid } = resultList[i]
                logger.write(`Found the Storybook Process at PID ${pid}`, this.fileName, 'storyBookProc')
                return this.aesopEmitter.emit('found_storybookps', pid)

            }
        }
        logger.write('Could not find Storybook Proc!', this.fileName, 'storyBookProc');
        
        return this.aesopEmitter.emit('start_storybook');
    }
}

export default StorybookChecker;