# Contributing

Thanks for your consideration on contributing to Aesop for Storybook! Each contribution helps make using Aesop for Storybook a better experience for everyone.

Aesop for Storybook is an open source project and thrives on community contributions! These contributions can come in many forms-- anywhere from improving documentation to submitting bug reports and feature requests. 

We are also open to any code contributions that can be assimilated into the extension itself! For inspiration, take a look at our roadmap below.

## First Time Contributing?

First time contributing to an open source project? You can learn more [here!](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

Now, you’re ready to contribute.

## Getting Started

If you find an area where you want to contribute, please fork the repository and create a branch with a descriptive name. 
 
A good branch name would be (where issue #234 is the ticket you're working on):
`git checkout -b 234-add-treeview`

Afterwards, if you feel like this contribution might help the project, feel free to send a pull request.

## Testing and Debugging Locally

After forking and cloning the repository, open the folder in VS Code. Make sure that your root directory is the Aesop folder. Once there, you can launch the VS Code built-in debugger using the shortcut F5. You can learn more about this [here](https://code.visualstudio.com/docs/editor/debugging)

After pressing F5, VS Code will build the extension and launch an Extension Development Host window as seen below. In order to test the extension, you will need to open a Storybook project as your root directory in VS Code, making sure that Storybook is a dependency in your node modules folder.

![extension development host](https://user-images.githubusercontent.com/55175891/73625080-60c2f800-4611-11ea-893c-c3128b561a28.PNG)

Once you've gotten everything set up, you can launch Aesop's webview by selecting 'Aesop Awaken' from the command palette *(CTRL+SHIFT+P)* or using the shortcut *(CTRL K+A)*.

You can also make use of VS Code's Webview Developer tools by selecting them in the command palette.

![dev tools webview](https://user-images.githubusercontent.com/55175891/73625433-ce235880-4612-11ea-9009-62141866e3d3.PNG)

Closing the Extension Development Host will also close all Aesop child processes and Storybook instances run within it.

However, be mindful. **The Extension Development Host will run the LAST WORKING VERSION of the extension. This means if you've introduced breaking changes, the version you're seeing might not be running the code you think.** To get around this, we usually implement a sort of hack-around solution by including a text counter as an HTML element within the web-view, changing it as we iterate. ...There's probably a better solution to this, but it's been working thus far.  

## How to Report a Bug

If you find a security vulnerability, please do NOT open an issue. Send a message to AesopStorybook@gmail.com instead.

When filing an issue, make sure to answer these questions:

1. What version of VS Code are you using?
2. What version of Storybook are you using for your project?
3. What operating system and processor architecture are you using?
4. What did you do? Please also include the following details:
  a. Was Storybook currently running before you launched the extension command?
  b. Did you have a port flag defined in your package.json storybook script?
5. What did you expect to see?
6. What did you see instead?

## How to Suggest a Feature

Aesop’s philosophy is to provide a seamless developer experience for using Storybook within VS Code. We want to keep the extension as light weight and easy to use as possible out of the box.

If you think of any feature that you might like to see in Aesop for Storybook, please open an issue on our issues list on Github describing the feature you’d like to see, why you need it, and how it should work.

## Roadmap

1. Fine-tuning windows compatibility for all developer workflows
  a. Storybook is already running w/ port flag defined in npm run storybook script(*working*)
  b. Storybook is already running w/o port flag defined
  (*working*)
  c. Storybook is not currently running w/ port flag defined (*not working*)
  d. Storybook is not currently running w/o port flag defined (*not working*)

2. Add cross-platform testing. 

3. Separate Storybook Manager from Preview iframe, replacing it with a vscode tree-view allowing you to interact with the Storybook preview from within the vscode explorer menu.

## Code Review Process

Under Construction

## Community

Under Construction
