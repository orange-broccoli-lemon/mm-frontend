import { createRouter, createWebHistory } from 'vue-router'

// 정적 import
import HomeView from '@/views/Main.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/SignUp.vue'
import MyPage from '@/views/MyPage.vue'
import HotMovieDetailView from '@/views/HotMovieDetailView.vue'

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
      path: '/auth/google/callback',
      name: 'google-callback',
      component: () => import('@/views/GoogleCallback.vue')
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: MyPage,
    },
    {
      path: '/HotMovieDetailView',
      name: 'HotMovieDetailView',
      component: HotMovieDetailView,
    },
    {
      path: '/movie/movieDetail/:id',
      name: 'BookDetail',
      component: () => import('@/views/DetailMovie.vue'),
    },
     
    {
      path: '/actors',
      name: 'AllActors',
      component: () => import('@/views/AllActorsView.vue'),
    },
    {
      path: '/person/:id',
      name: 'ActorDetail',
      component: () => import('@/views/ActorDetailView.vue'),
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
          props: true
        },
        {
          path: 'create_thread/:id',
          name: 'CreateThread',
          // 동적 import
          component: () => import('@/views/CreateThread.vue'),
          props: true
        },
      ],
    },
  ],
})

export default router