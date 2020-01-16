export default {
  name: 'EmployeeForm ',

  data() {
    return {
      employee: {
        name: 'test1',
        email: 'test2',
      },
    }
  },

  template: `
    <div id="employee-form">
      <form>
        <label>Employee Name</label>
        <input type="text"/>
        <label>Employee e-mail</label>
        <input type="text"/>
        <button>Add Employee</button>
      </form>
    </div>
  `
};
