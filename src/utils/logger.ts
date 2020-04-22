import * as fs from "fs";
import * as path from 'path';
import { performance } from 'perf_hooks';

class Logger {
    private writeStream;

    open(rootDir: string): void {
        this.writeStream = fs.createWriteStream(path.join(rootDir, `AesopLogs.txt`));
        this.writeStream.on('error', (err) => {
            throw new Error(err);
        })
    }

    write(data: string, fileName: string, functionName: string): void {
        this.writeStream.write(`[${performance.now()}] ${fileName} / ${functionName}():\n` + data + '\n');
    }

    end(): void {
        this.writeStream.end();
    }

}


export default new Logger();
