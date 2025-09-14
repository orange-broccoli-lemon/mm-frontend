import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Main.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '@/views/SignUp.vue'
import MyPage from '@/views/MyPage.vue'

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
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
    },
    {
      path: '/myPage',
      name: 'myPage',
      component: MyPage,
    },
  ],
})

export default router
