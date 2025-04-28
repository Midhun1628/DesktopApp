<template>
  <div id="app">
    <header>
      <h1>My Vue App</h1>
      <nav>
        <router-link to="/login">Login</router-link>
        <router-link to="/register">Register</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
      </nav>
    </header>
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f8f9fa;
}
#app {
  text-align: center;
}
header {
  background-color: #42b983;
  padding: 15px;
  color: white;
}
nav {
  margin-top: 10px;
}
nav a {
  margin: 0 10px;
  color: white;
  text-decoration: none;
}
nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
main {
  padding: 30px;
}
</style>
