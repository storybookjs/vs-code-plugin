import logger from '../utils/logger';

class AesopViewCreator {
    private vscode;
    private statusText;
    private currentPanel;
    private context;
    constructor({ vscode, context, statusText, currentPanel }) {
        this.vscode = vscode;
        this.context = context;
        this.statusText = statusText;
        this.currentPanel = currentPanel;
        this.createAesop = this.createAesop.bind(this);
    }


    createAesop(port: number, host: string = 'localhost'): void {
        logger.write(`Attempting to create webview`)
        //currentPanel stores our webview. If createAesop is called with an active webview open, display an error message. If not, create a new panel and reassign global variable.
        if (this.currentPanel) {
            this.vscode.window.showErrorMessage(`Aesop has already been run.`);
            return;
        }

        this.statusText.hide();
        this.vscode.window.showInformationMessage(`Welcome to Aesop Storybook`);
        this.currentPanel = this.vscode.window.createWebviewPanel(
            'aesop-sb',
            'Aesop',
            this.vscode.ViewColumn.Beside,
            {
                enableCommandUris: true,
                enableScripts: true,
                portMapping: [{
                    webviewPort: port,
                    extensionHostPort: port
                }],
                localResourceRoots: [this.vscode.Uri.file(this.context.extensionPath)],
            }
        );

        this.currentPanel.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Aesop</title>
            <style>
                html { width: 100%; height: 100%; min-width: 20%; min-height: 20%;}
                body { display: flex; flex-flow: column nowrap; padding: 0; margin: 0; width: 100%' justify-content: center}
            </style>
        </head>
        <body>
            <iframe src="http://${host}:${port}" width="100%" height="600"></iframe>
        </body>
    </html>`

        this.currentPanel.onDidDispose(() => {
            this.currentPanel = undefined;
        }, null, this.context.subscriptions);


    }
} // close createAesop helper function

export default AesopViewCreator;