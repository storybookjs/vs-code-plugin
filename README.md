![AesopLogo_small](https://user-images.githubusercontent.com/55175891/72542775-b433f880-3852-11ea-8483-02066bc9e8ca.jpg)

# AESOP
Meet Aesop: the lightweight Storybook preview extension.
 
This humble helper displays your Storybook alongside a codebase for more responsive workflow. It integrates with existing Storybook addons and features, and it is optimized to use minimal system resources.

## Screenshots
![Aesop Awoken](https://user-images.githubusercontent.com/55175891/72540358-b3996300-384e-11ea-9477-e8823d1aedaa.gif)

Here we activate the "Aesop Awaken" command from the command palette to jumpstart the initialization process that checks whether your storybook is currently running. In this case, we have already run a Storybook server from the command line, so Aesop dynamically selects the port where the content is being served and displays it in a webview.

## Features
If you are working in a project folder on a Storybook-enabled application, Aesop will run a Storybook process at startup and display the same suite you're used to right inside Visual Studio Code as an attached Node child process.

Or, if you're used to starting up your Storybook from the CLI with additional arguments, Aesop won't impede your workflow — it understands Node processes, and will happily retrieve your running Storybook.

## How To Use The Extension
Simply install the extension from the Visual Studio Code Marketplace and open a project folder with a Storybook dependency as your main workspace folder. 

Then you can start previewing Storybook directly in your editor after following a few steps:

First, execute the 'Aesop Awaken' command from the command palette, or by using the shortcut keybinding.

From here, Aesop checks to see whether or not you currently have a Storybook process running. 

If it does not find a Storybook process, it will spin up a new instance of Storybook using your npm script within your package.json, along with any arguments you've supplied.

If it does find a Storybook process, it dynamically captures the location in which the content is being served and displays it within a webview directly in your IDE.

## Requirements
Aesop only depends on the ps-node library. This is used to simplify certain lookup functions while accessing running Node processes, but will likely be removed in a future version to make Aesop dependency-free.

If your system does not support Netstat, you may experience some issues using this beta release.

## Extension Settings
Because Aesop is lightweight, it is also minimal config. It contributes one hotkey command chord to activate: CTRL / CMD K + A

The Aesop team aims to provide further customization options and improved UI integration within Visual Studio Code as development continues.

## Release Notes
Please contact the developers at https://github.com/Async-Aesop/aesop with comments, questions, and any features you would like to see in a future version of Aesop.

## Known Issues
On Windows, you MUST have Storybook already running for Aesop to work. We are currently tackling this issue and expect it to be resolved soon.

### 0.1.0
Aesop is pleased to make your acquaintance.

If you are downloading the repository to play with Aesop's code, you may need to install dependencies for the sample React and Vue component files before use. Happy testing!
