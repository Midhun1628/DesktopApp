<template>
    <div class="register-wrapper">
      <div class="register-card">
        <h2>Login</h2>
        <form @submit.prevent="login">
          <input v-model="email" type="email" placeholder="Email" required />
          <input v-model="password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import api from '../../axios/axios.js'
  
  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      async login() {
        try {
          const response = await api.post('/login', {
            email: this.email,
            password: this.password,
          });
          localStorage.setItem("token", response.data.token);
          this.$router.push('/dashboard');
        } catch (err) {
          console.error("Login failed:", err);
          alert("Invalid credentials or server error.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .register-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
  }
  .register-card {
    background: #fff;
    padding: 50px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 320px;
  }
  input {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
  }
  button {
    width: 100%;
    padding: 10px;
    background-color: #42b983;
    border: none;
    color: white;
    font-weight: bold;
    cursor: pointer;
  }
  </style>
  ``
  