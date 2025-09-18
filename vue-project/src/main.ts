import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'  
import router from './router'
import { useAccountStore } from './stores/user'
import { useThemeStore } from './stores/theme'
import axios from 'axios'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Axios 인터셉터 설정 (전역 401 에러 처리)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 401 에러 발생 시 자동 로그아웃
      const accountStore = useAccountStore()
      if (accountStore.token) {
        console.log('401 에러 감지 - 자동 로그아웃 처리')
        accountStore.logOut()
      }
    }
    return Promise.reject(error)
  }
)

// 인증 상태 및 테마 초기화
const initializeApp = async () => {
  const accountStore = useAccountStore()
  const themeStore = useThemeStore()
  
  await accountStore.initializeAuth()
  
  // 테마 초기화 (VueUse가 자동으로 처리하지만 명시적으로 호출)
  console.log('🎨 앱 초기화 - 테마 상태:', themeStore.isDark)
}

// 앱 마운트 전에 인증 상태 초기화
initializeApp().then(() => {
  app.mount('#app')
})

// 구글 로그인을 위한 메타 태그 추가
const addGoogleMeta = () => {
  const meta = document.createElement('meta')
  meta.name = 'google-signin-client_id'
  meta.content = import.meta.env.VITE_GOOGLE_CLIENT_ID
  document.head.appendChild(meta)
}

// DOM이 로드된 후 메타 태그 추가
document.addEventListener('DOMContentLoaded', addGoogleMeta)