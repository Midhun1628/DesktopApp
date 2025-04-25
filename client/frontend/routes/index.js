import { createRouter, createWebHistory } from 'vue-router';
import Register from './../src/components/Register.vue';
import Login from './../src/components/Login.vue';
import Dashboard from './../src/components/Dashboard.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
