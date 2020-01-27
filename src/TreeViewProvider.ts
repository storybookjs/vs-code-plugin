import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface Story {
  kind: string
  stories: StoryObject[]
}

export interface StoryObject {
  id: string
  name: string
}

export class TreeViewProvider implements vscode.TreeDataProvider<Dependency> {
  private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<
    Dependency | undefined
  >()
  readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event

  //the stories property takes an array of Story interface types
  stories: Story[]
  initialCollapsibleState: number

  constructor() {
    //each tree initialises with an empty array for stories
    this.stories = []
    //vscode.TreeItemCollapsibleState.Expanded has a number value (0 none, 1 collapsed, 2 expanded)
    this.initialCollapsibleState = vscode.TreeItemCollapsibleState.Expanded
  }

  collapseAll(): void {
    //this method assigns collapsed state value (1) to the entire tree
    this.initialCollapsibleState = vscode.TreeItemCollapsibleState.Collapsed
    //this method (defined below) fires _onDidChangeTreeData
    this.refresh()
  }

  expandAll(): void {
    this.initialCollapsibleState = vscode.TreeItemCollapsibleState.Expanded
    this.refresh()
  }

  //fires the onDidChangeTreeData method
  //here, that relies on the event Thenable of encountering a Dependency type
  //the Dependency is the output of the iteration function that maps your story files
  
  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  //returns a tree-item version of the given element, the Dependency class
  getTreeItem(element: Dependency): vscode.TreeItem {
    return element
  }

  //optional parameter "story?" would be a Dependency type
  //if there is one, it resolves promise with a thenable array of Dependencys

  getChildren(story?: Dependency): Thenable<Dependency[]> {
    return new Promise(resolve => {
      //if a story variable is passed in...
      if (story) {
        // show stories for that section (screening the entries in this object's
        //"stories" property (array of Dependencies) to see if their "kind"
        //property is equal to story.contextValue

        //each element in the "stories" property Array is a Story interface
        //the "kind" property is a string (that contains, presumably, the story's
        //test case name identifier (the name of an export on a stories.js file)
        const section = this.stories.find(el => el.kind === story.contextValue)

        //if section is truthy (e.g. if we have found els (Story interfaces
        //instantiations) that are indeed "stories" (property on TreeProvider) where 
        //(kind == story.contextValue)) we screen out top-level components
        //this is all to say: "kind" seems to be the component for which stories have been defined by the user

        //we could change that nomenclature to be more declarative
        if (section) {
          //declare a "previews" variable that maps each element of the
          //Array yielded by "section" so that the Story element gives its
          //"name" as the "label" AND "storyKind" property to a new Dependency
          //beneath that section (the Component header)

          //TO CHECK THE COMMAND (extension.openStory) --> ours might want to make a query to the url path of that story. The arguments sent along with it here are the section array itself and the current element.

          const previews = section.stories.map(
            el =>
              new Dependency(el.name, vscode.TreeItemCollapsibleState.None, el.name, {
                command: "extension.openStory",
                title: "",
                arguments: [section, el]
              })
          )
          //Promise resolution clause: if (section) --> map fn --> resolve to output previews
          //for use outside this if (story) block. Otherwise resolve to an empty array

          resolve(previews)
        } else {
          resolve([])
        }
      } else {
        // if no story? Dependency argument is passed in, previews is declared as a map on the elements in the array stored in the "stories" property on the TreeProvider

        //why does it not get a command? again, review what openStory action does
        const previews = this.stories.map(el => new Dependency(el.kind, this.initialCollapsibleState, el.kind))
        resolve(previews)
      }
    })
  }
}

class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly storyKind: string,
    public readonly command?: vscode.Command
  ){
    super(label, collapsibleState)
  }

  //be sure to add an icon vector file to display stories beneath the label headers
  iconPath = {
    light: path.join(__dirname, "../resources/dark/StoryTreeItem.svg"),
    dark: path.join(__dirname, "../resources/dark/StoryTreeItem.svg")
  }
  contextValue = this.storyKind;
}

/*
Context value of the tree item. This can be used to contribute item specific actions in the tree. For example, a tree item is given a context value as folder. When contributing actions to view/item/context using menus extension point, you can specify context value for key viewItem in when expression like viewItem == folder.

"contributes": {
        "menus": {
            "view/item/context": [
                {
                    "command": "extension.deleteFolder",
                    "when": "viewItem == folder"
                }
            ]
        }
}
This will show action extension.deleteFolder only for items with contextValue is folder.
*/
