// src/stories.js

import EmployeeForm from './EmployeeForm'

export default {
  title: 'Employee Form',
  component: EmployeeForm
}

export const Default_Employee_Form = () => ({
  components: { EmployeeForm },
  template: `
    <div id="employee-form">
      <form>
        <label>Employee Name</label>
        <input type="text" placeholder="Ola the Node Master"/>
        <label>Employee e-mail</label>
        <input type="text" placeholder="NodeMaster@Aesop.com"/>
        <button>Add Employee</button>
      </form>
    </div>
  `
});