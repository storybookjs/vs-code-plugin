import logger from '../utils/logger';


class AesopViewCreator {
    private fileName: string;
    private vscode;
    private statusText;
    private currentPanel;
    private context;
    constructor({ vscode, context, statusText, currentPanel }) {
        this.vscode = vscode;
        this.context = context;
        this.statusText = statusText;
        this.currentPanel = currentPanel;
        this.fileName = 'create-webview.ts'
        this.createAesop = this.createAesop.bind(this);
    }


    createAesop(port: number, host: string = 'localhost'): void {
        logger.write(`Attempting to create webview`, this.fileName, 'createAesop')
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

        this.currentPanel.webview.html = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${this.currentPanel.webview.cspSource} https:; script-src ${this.currentPanel.webview.cspSource} http: https: 'unsafe-inline'; style-src ${this.currentPanel.webview.cspSource} http: https: 'unsafe-inline'; frame-src http: https: 'unsafe-inline';"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Aesop</title>
            <style>
              html { width: 100%; height: 100%; min-width: 20%; min-height: 20%;}
              body { display: flex; flex-flow: column nowrap; padding: 0; margin: 0; width: 100%;  height: 100%; justify-content: center}
            </style>
          </head>
          <body>
          <iframe id="sb_iFrame" src="http://localhost:${port}" width="100%" height="100%"
          sandbox="allow-scripts allow-same-origin allow-top-navigation">
            <script>
            window.top.console.log('inner');
            </script>
      </iframe>
  
      <script>
        console.log('outer');
      </script>
          </body>
        </html>`

        this.currentPanel.onDidDispose(() => {
            this.currentPanel = undefined;
        }, null, this.context.subscriptions);


    }
} // close createAesop helper function

export default AesopViewCreator;