import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'  
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 구글 로그인을 위한 메타 태그 추가
const addGoogleMeta = () => {
  const meta = document.createElement('meta')
  meta.name = 'google-signin-client_id'
  meta.content = import.meta.env.VITE_GOOGLE_CLIENT_ID
  document.head.appendChild(meta)
}

// DOM이 로드된 후 메타 태그 추가
document.addEventListener('DOMContentLoaded', addGoogleMeta)

app.mount('#app')