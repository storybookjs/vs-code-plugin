import React from 'react';
import { storiesOf } from '@storybook/react';


import CharacterCard from './CharacterCard';

export default {
  component: CharacterCard,
  title: 'Character Card',
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
};

storiesOf('CharCard', module)
  .add('Luke Skywalker - CharCard', () => <CharacterCard />)
