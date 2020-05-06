import * as os from 'os';

const netStatCommandLibrary = {
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

const searchCommandLibrary = {
    linux: {
        cmd: "grep"
    },
    darwin: {
        cmd: "grep"
    },
    win32: {
        cmd: "FINDSTR"
    }
}


const platform: NodeJS.Platform = os.platform();
const netstatCommand = netStatCommandLibrary[platform];
const searchCommand = searchCommandLibrary[platform];
export default {
    netstatCommand, searchCommand, platform
}