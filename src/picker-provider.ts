import { Story, StoryObject, TreeViewProvider } from "./treeviewProvider";

//here we import the Story interface (which contains an Array of StoryObjs--> so basically, the target React Component for which there exists an array of story test cases), the StoryObject, and the TreeProvider 

//this picker provider makes a QuickPick from the generated story treeview

export interface StorySelection {
  kind: string
  story: string
  storyId: string
}

export class StoryPickerProvider {
  stories: Story[]
  storyList: StoryObject[]

  public static delimiter = " - "
  public static delimiterId = "--"

  constructor(storiesProvider: TreeViewProvider) {
    //props of TreeViewProvider passed to this StoryPickerProvider
    storiesProvider.onDidChangeTreeData(story => {
      const { stories } = storiesProvider
      this.stories = stories
    })
  }

  //picker result is retrieving the URL for it, ISN'T IT
  getParts(pickerResult: string): StorySelection {
    const [kind, story] = pickerResult.split(StoryPickerProvider.delimiter)
    const storyId = `${kind.toLowerCase()}${StoryPickerProvider.delimiterId}${story.toLowerCase().replace(/ /g, "-")}`
    return { kind, story, storyId }
  }

  //this "list" variable is basically an array of URL paths that each treeItem will get as a target for its onClick, I bet
  flattenStories(): string[] {
    if (!this.stories) return
    const unsorted = this.stories.reduce((list, section) => {
      const group = section.kind
      const stories = section.stories.map(story => `${group}${StoryPickerProvider.delimiter}${story.name}`)
      return list.concat(stories)
    }, [])

    return unsorted.sort()
  }

  toList(): string[] {
    return this.flattenStories()
  }
}