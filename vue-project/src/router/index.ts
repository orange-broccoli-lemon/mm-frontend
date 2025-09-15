import { createRouter, createWebHistory } from 'vue-router'

// 정적 import
import HomeView from '@/views/Main.vue'
import LoginView from '@/views/LoginView.vue'
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
      path: '/mypage',
      name: 'mypage',
      component: MyPage,
    },

    {
      path: '/community',
      children: [
        {
          path: '',
          name: 'CommunityView',
          // 동적 import
          component: () => import('@/views/CommunityView.vue'),
        },
        {
          path: 'detail/:id',
          name: 'ThreadDetail',
          // 동적 import
          component: () => import('@/components/ThreadDetail.vue'),
        },
        {
          path: 'create_thread/:id',
          name: 'CreateThread',
          // 동적 import
          component: () => import('@/views/CreateThread.vue'),
        },
      ],
    },
  ],
})

export default router
