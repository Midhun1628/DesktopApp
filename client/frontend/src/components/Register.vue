<template>
    <div class="register-wrapper">
      <div class="register-card">
        <h2>User Registration</h2>
        <form @submit.prevent="handleRegister">
          <input v-model="form.username" placeholder="Username" required />
          <input v-model="form.email" placeholder="Email" type="email" required />
          <input v-model="form.password" placeholder="Password" type="password" required />
          <button type="submit">Register</button>
          <p v-if="!isOnline" class="offline-msg">
            You are offline. We'll save your data and sync it later.
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import api from './../../axios/axios.js';
  import { useToast } from 'vue-toastification';
  
const toast=useToast()

  export default {
    data() {
      return {
        form: { username: '', email: '', password: '' },
        isOnline: navigator.onLine,
      };
    },
    created() {
  window.addEventListener("online", this.syncOfflineData);
  window.addEventListener("offline", this.setOffline);
},
beforeUnmount() {
  window.removeEventListener("online", this.syncOfflineData);
  window.removeEventListener("offline", this.setOffline);
},
methods: {
  setOffline() {
    this.isOnline = false;
  },
      async handleRegister() {
        const userData = { ...this.form };
        if (this.isOnline) {
          try {
            await api.post("/register", userData);

            this.$router.push('/login');
            toast.success("User registered successfully!");
           
          } catch (err) {
            toast.error("Error saving online:", err);
          }
        } else {
          let offlineData = JSON.parse(localStorage.getItem("offline_users")) || [];
          offlineData.push(userData);
          localStorage.setItem("offline_users", JSON.stringify(offlineData));
          toast.error("You're offline! We'll sync your data when you're back online.");
          this.form.username = '';
          this.form.email = '';
          this.form.password = '';
        }
      },
  
      async syncOfflineData() {
  this.isOnline = true;
  const offlineData = JSON.parse(localStorage.getItem("offline_users")) || [];

  // If only one user, try once and exit
  if (offlineData.length === 1) {
    try {
      await api.post("/register", offlineData[0]);
      toast.success("Single offline user synced to DB");
      localStorage.removeItem("offline_users");
      this.$router.push('/login');
    } catch (err) {
      toast.error(`Error syncing single user: ${err.response?.data?.message || err.message}`);
    }
    return;
  }

  // For multiple users
  for (const user of offlineData) {
    try {
      await api.post("/register", user);
      toast.success("User synced from local to DB");
    } catch (err) {
      toast.error(`Error syncing user: ${err.response?.data?.message || err.message}`);
      return;
    }
  }

  localStorage.removeItem("offline_users");
  toast.success("All offline users data saved to database!");
}
,
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
  .offline-msg {
    color: red;
    font-size: 0.9em;
    margin-top: 10px;
  }
  </style>
  