<template>
    <div>
      <h1>Welcome to Dashboard !!</h1>
      <p>This page is only displayed when you are logged in !!</p>
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        localStorage.removeItem('token'); // Clear token
        this.$router.push('/login');      // Redirect to login
      }
    }
  };
  </script>
  