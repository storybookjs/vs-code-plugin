import { configure } from '@storybook/react';
import '../client/components/index.css';

configure(require.context('../client/components', true, /\.stories\.js$/), module);