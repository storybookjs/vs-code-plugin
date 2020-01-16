import React from 'react';
import { storiesOf } from '@storybook/react';

import CreateCharacter from './CreateCharacter';

export default {
  component: CreateCharacter,
  title: 'Create Character Card',
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
};

storiesOf('Create Character', module)
  .add('Basic Character Creator Box', () => <CreateCharacter />)
