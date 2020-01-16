// .storybook/config.js

import Vue from 'vue';
import { configure } from '@storybook/vue';
import '../src/components/index.css';
// Import your custom components.
import EmployeeForm from '../src/components/EmployeeForm.vue'
import EmployeeTable from '../src/components/EmployeeTable.vue'

// Register custom components.
Vue.component('item', EmployeeForm);
Vue.component('item', EmployeeTable)


function loadStories() {

  // You can require as many stories as you need.
  require('../src/components/EmployeeForm.stories')
  require('../src/components/EmployeeTable.stories')
}

configure(loadStories, module);