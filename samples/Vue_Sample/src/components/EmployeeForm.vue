<template>
  <div id="employee-form">
    <form>
      <label>Employee Name</label>
      <input type="text"/>
      <label>Employee e-mail</label>
      <input type="text"/>
      <button>Add Employee</button>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'employee-form',
    data() {
      return {
        employee: {
          name: '',
          email: '',
        },
      }
    },
  }
</script>

<style scoped>

</style>