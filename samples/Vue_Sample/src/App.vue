<template>
  <div id="app" class="small-container">
    <div class = "vueimg" >
      <img alt="Vue logo" src="./assets/logo.png">
    </div>
    <h1>Employees</h1>
    <div>
      <employee-form />
      <employee-table :employees="employees" />
    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import EmployeeTable from '@/components/EmployeeTable.vue'
import EmployeeForm from '@/components/EmployeeForm.vue'

export default {
  name: 'app',
  components: {
    EmployeeTable,
    EmployeeForm
  },
  data() {
    return {
      employees: [
        {
          id: 1,
          name: 'Richard Hendricks',
          email: 'richard@piedpiper.com',
        },
        {
          id: 2,
          name: 'Bertram Gilfoyle',
          email: 'gilfoyle@piedpiper.com',
        },
        {
          id: 3,
          name: 'Dinesh Chugtai',
          email: 'dinesh@piedpiper.com',
        },
      ],
    }
  },
  
}

</script>

<style>
  button {
    background: #009435;
    border: 1px solid #009435;
  }

  .small-container {
    max-width: 680px;
  }

  .vueimg {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
