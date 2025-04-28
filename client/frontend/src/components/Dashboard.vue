<template>
  <div>
    <h1>Welcome to Dashboard, {{ username }}!</h1>
    <p>This page is only displayed when you are logged in.</p>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: localStorage.getItem("username") // Retrieve the username from localStorage
    };
  },
  methods: {
    logout() {
      localStorage.clear(); // Clear token and other data from localStorage
      this.$router.push('/login'); // Redirect to login page
    }
  }
};
</script>
