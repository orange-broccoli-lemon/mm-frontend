import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Main.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '@/views/SignUp.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    }
  ],
})

export default router
