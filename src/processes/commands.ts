import * as os from 'os';

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


const platform: NodeJS.Platform = os.platform();
const command = commands[platform];

export default {
    command, platform
}