// import Provider from '@storybook/ui';
// import * as React from 'react';
// import addons from '@storybook/addons';
// import { Channel } from '@storybook/channels';

// // https://www.npmjs.com/package/@storybook/channels
// //https://github.com/storybookjs/storybook/tree/next/lib/ui/src
// //https://storybook.js.org/docs/configurations/options-parameter/

// export default class TreeViewProvider extends Provider {
//   getElements(type){
//     return {};
//   }

//   renderPreview(){
//     return `<p>This is the preview</p>`
//   }

//   handleAPI(api){
//     api.setOptions({});

//     api.setStories([
//       {
//         kind: 'Component 1',
//         stories: ['State 1', 'State 2']
//       }
//     ]);

//     api.onStory((kind, story) => {
//       this.globalState.emit('change', kind, story);
//     })
//   }
// }