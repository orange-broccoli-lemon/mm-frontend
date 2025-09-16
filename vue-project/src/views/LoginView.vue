<template>
  <main class="login">
    <h1>Login</h1>

    <!-- 일반 로그인 폼 -->
    <form @submit.prevent="logInMember">
      <div class="form-group">
        <label for="username">ID</label>
        <input id="username" v-model="username" type="text" placeholder="ID 입력" required />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input id="password" v-model="password" type="password" placeholder="비밀번호 입력" required />
      </div>

      <button type="submit">로그인</button>
    </form>

    <div class="divider"><span>또는</span></div>

    <!-- 구글 로그인 버튼 렌더링 영역 -->
    <div class="google-login"></div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAccountStore } from '../stores/user'

const store = useAccountStore()
const username = ref('')
const password = ref('')

// 환경변수에서 Google Client ID 가져오기
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

// 일반 로그인 처리
const logInMember = () => {
  const userData = {
    email: username.value,
    password: password.value,
  }
  store.login(userData)
}

// 구글 로그인 콜백 함수
declare global {
  interface Window {
    handleCredentialResponse: (response: any) => void
    google: any
  }
}

window.handleCredentialResponse = async (response: any) => {
  console.log('구글 로그인 응답:', response)
  if (response.credential) {
    const result = await store.googleLogin(response.credential)
    if (!result?.success) {
      alert('구글 로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }
}

// 구글 로그인 버튼 렌더링
onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  document.head.appendChild(script)

  script.onload = () => {
    console.log('Google Identity Services 스크립트 로드 완료')

    // 초기화
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: window.handleCredentialResponse,
    })

    // 버튼 렌더링
    window.google.accounts.id.renderButton(
      document.querySelector('.google-login'),
      {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
      }
    )

    // 자동 팝업 해제 (선택)
    window.google.accounts.id.prompt()
  }
})
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 0.7rem;
  width: 100%;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

.divider {
  text-align: center;
  margin: 2rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #ddd;
}

.divider span {
  background-color: white;
  padding: 0 1rem;
  color: #666;
}

.google-login {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
