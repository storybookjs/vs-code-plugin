import * as fs from "fs";
import * as path from 'path';

class Logger {
    private writeStream;
    private date = new Date();
    private timeStamp:string = this.date.toDateString();
    private rootDir;
    private letterken = 'letters'
    // const date = new Date();
    // const dateStr = date.toISOString();

    open(rootDir: string): void {
        this.writeStream = fs.createWriteStream(path.join(rootDir, `AesopLogs.txt`));
        this.writeStream.on('error', (err) => {
            throw new Error(err);
        })
    }

    write(data: string): void {
        this.writeStream.write(`at ${this.date.toISOString()}:\n` + data + '\n');
        // fs.appendFileSync(path.join(rootDir, "poop.txt"), data);
    }

    end(): void {
        this.writeStream.end();
    }

}


export default new Logger();
