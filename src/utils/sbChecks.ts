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
    aesopEmitter: any;
    constructor({ rootDir, vscode, aesopEmitter }) {
        this.rootDir = rootDir;
        this.vscode = vscode;
        this.aesopEmitter = aesopEmitter;
        logger.open(rootDir);
    }
    //check if Storybook is a dependency
    dependency(): void {

        try {
            fs.accessSync(path.join(this.rootDir, '/node_modules/@storybook'));
            logger.write('Aesop has found a Storybook dependency');
            this.aesopEmitter.emit('found_dependency')

        } catch (error) {
            logger.write('Error finding storybook dependency');
            this.vscode.window.showErrorMessage(`Aesop could not find Storybook as a dependency in the active folder, ${this.rootDir}`);
            throw new Error('Error finding a storybook project');
        }
    }


    //should I separate the nodeProc checks into the process service?
    //if I do, I can decouple vscode from this class and turn it into a function instead

    //this is where I'm currently getting errors.

    nodeProc() {
        // const psLookup = util.promisify(ps.lookup);
        logger.write('Looking for node processes!')
        ps.lookup({ command: 'node', psargs: 'ux' }, (err, resultList) => {
            if (err) return this.aesopEmitter('error', err);
            logger.write(`Found node processes!`);
            this.aesopEmitter.emit('found_nodeps', resultList)
        });
        
    }

    //can definitely optimize
    storyBookProc(resultList: []): void {
        logger.write('Looking for Storybook Process!')
        for (let i = 0; i < resultList.length; i++) {
            let process = resultList[i];
            if (process.arguments[0].includes('node_modules') && process.arguments[0].includes('storybook')) {
                logger.write('Found Storybook Proc!')
                return this.aesopEmitter.emit('found_storybookps', process)

            }
        }
        logger.write('Could not find Storybook Proc!');
        return this.aesopEmitter.emit('start_storybook');
    }

}
export default StorybookChecker;