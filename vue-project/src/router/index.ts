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
import CategoryDetailView from '@/views/CategoryDetailView.vue'


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
      path: '/hot-movie-detail',
      name: 'hot-movie-detail',
      component: HotMovieDetailView,
    },

    {
      path: '/category',
      name: 'category',
      component: () => import('@/views/Category.vue'),
      
    },
    {
      path: '/category/:genreId',   // ✅ 동적 라우트 추가
      name: 'category-detail',
      component: CategoryDetailView,
      props: true, // params.id → props.id 로 받을 수 있음
    },
    {
      path: '/select-movie',
      name: 'select-movie',
      component: () => import('@/views/SelectMovie.vue'),
    },
    {
      path: '/create-review',
      name: 'create-review',
      component: () => import('@/views/CreateThread.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/update-review/:id',
      name: 'update-review',
      component: () => import('@/views/UpdateThread.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/search',
      name: 'search-results',
      component: () => import('@/views/SearchResults.vue'),
    },
    {
      path: '/movie/movie-detail/:id',
      name: 'movie-detail',
      component: () => import('@/views/DetailMovie.vue'),
    },

    {
      path: '/actors',
      name: 'all-actors',
      component: () => import('@/views/AllActorsView.vue'),
    },
    {
      path: '/person/:id',
      name: 'actor-detail',
      component: () => import('@/views/ActorDetailView.vue'),
    },
    {
      path: '/user/:userId',
      name: 'user-profile',
      component: () => import('@/views/UserProfileView.vue'),
    },

  ],
})

// 라우터 가드 설정
router.beforeEach(async (to, from, next) => {
  const accountStore = useAccountStore()
  
  // 스토어의 토큰 상태를 사용 (localStorage 직접 접근 방지)
  const isAuthenticated = !!accountStore.token

  // 인증이 필요한 페이지
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      console.log('인증이 필요합니다. 로그인 페이지로 리다이렉트')
      next({ name: 'login' })
      return
    }
    
    // 토큰이 있지만 유효한지 검증
    try {
      const isValid = await accountStore.validateToken()
      if (!isValid) {
        console.log('토큰이 유효하지 않습니다. 로그인 페이지로 리다이렉트')
        next({ name: 'login' })
        return
      }
    } catch (error: any) {
      console.error('토큰 검증 중 오류:', error)
      
      // 서버 오류(500)나 네트워크 오류인 경우 토큰을 유효한 것으로 간주
      if (error.response?.status === 500 || !error.response) {
        console.log('서버/네트워크 오류로 토큰 검증 실패. 계속 진행합니다.')
        next()
        return
      }
      
      // 기타 에러는 로그인 페이지로 리다이렉트
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