import { createRouter, createWebHistory } from 'vue-router'
import { useAccountStore } from '@/stores/user'

// 라우터 메타 타입 정의
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresGuest?: boolean
  }
}

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
      meta: { requiresGuest: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
      meta: { requiresGuest: true }
    },
    

    {
      path: '/mypage',
      name: 'mypage',
      component: MyPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/HotMovieDetailView',
      name: 'HotMovieDetailView',
      component: HotMovieDetailView,
    },
    {
      path: '/select-movie',
      name: 'SelectMovie',
      component: () => import('@/views/SelectMovie.vue'),
    },
    {
      path: '/create-review',
      name: 'CreateReview',
      component: () => import('@/views/CreateThread.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/update-review/:id',
      name: 'UpdateReview',
      component: () => import('@/views/UpdateThread.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/search',
      name: 'SearchResults',
      component: () => import('@/views/SearchResults.vue'),
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
      path: '/user/:userId',
      name: 'UserProfile',
      component: () => import('@/views/UserProfileView.vue'),
    },

    {
      path: '/community',
      children: [

        {
          path: 'create_thread/:id',
          name: 'CreateThread',
          // 동적 import
          component: () => import('@/views/CreateThread.vue'),
          props: true,
          meta: { requiresAuth: true }
        },
      ],
    },
  ],
})

// 라우터 가드 설정
router.beforeEach((to, from, next) => {
  const accountStore = useAccountStore()
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  // 인증이 필요한 페이지
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      console.log('인증이 필요합니다. 로그인 페이지로 리다이렉트')
      next({ name: 'login' })
      return
    }
  }

  // 게스트만 접근 가능한 페이지 (로그인/회원가입)
  if (to.meta.requiresGuest) {
    if (isAuthenticated) {
      console.log('이미 로그인되어 있습니다. 마이페이지로 리다이렉트')
      next({ name: 'mypage' })
      return
    }
  }

  // 모든 조건을 통과하면 다음으로 진행
  next()
})

export default router