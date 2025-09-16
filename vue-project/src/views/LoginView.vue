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

    <!-- Google Identity Services 로그인 버튼 -->
    <div id="g_id_onload"
         :data-client_id="googleClientId"
         data-callback="handleCredentialResponse"
         data-auto_prompt="false">
    </div>
    <div class="g_id_signin"
         data-type="standard"
         data-size="large"
         data-theme="outline"
         data-text="sign_in_with"
         data-shape="rectangular"
         data-logo_alignment="left">
    </div>
    
    <!-- 대안: 수동 Google 로그인 버튼 -->
    <button v-if="showManualButton" class="google-login-btn" @click="redirectToGoogle">
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="G" width="20" />
      Google 계정으로 로그인 (수동)
    </button>

    <!-- 에러 메시지 표시 -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAccountStore } from '../stores/user'
import { useRouter } from 'vue-router'

const store = useAccountStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const showManualButton = ref(false)

// Google Client ID - 환경변수에서 가져오거나 기본값 사용
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'

// 디버깅을 위한 로그
console.log('현재 Google Client ID:', googleClientId)
console.log('환경변수 VITE_GOOGLE_CLIENT_ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID)

// 리디렉션 URI - 환경변수에서 가져오거나 기본값 사용
const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || window.location.origin

// 일반 로그인 처리
const logInMember = async () => {
  errorMessage.value = ''
  const userData = {
    email: username.value,
    password: password.value,
  }
  try {
    await store.login(userData)
  } catch (error) {
    errorMessage.value = '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
  }
}

// Google 로그인 리디렉션 처리
const redirectToGoogle = () => {
  try {
    errorMessage.value = ''
    
    // Google Client ID 유효성 검사
    if (!googleClientId || googleClientId === 'YOUR_GOOGLE_CLIENT_ID') {
      errorMessage.value = 'Google Client ID가 설정되지 않았습니다. .env 파일을 확인해주세요.'
      return
    }
    
    // Google OAuth URL 생성 (id_token 방식)
    console.log('리디렉션 URI:', redirectUri)
    
    const params = new URLSearchParams({
      client_id: googleClientId,
      redirect_uri: redirectUri,
      response_type: 'id_token',
      scope: 'openid email profile',
      nonce: Date.now().toString(),
      state: 'google_oauth_state',
      access_type: 'offline',
      prompt: 'select_account'
    })
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    
    console.log('Google OAuth URL:', googleAuthUrl)
    
    // Google OAuth 페이지로 리디렉션
    window.location.href = googleAuthUrl
  } catch (error) {
    console.error('Google 로그인 리디렉션 실패:', error)
    errorMessage.value = 'Google 로그인 페이지로 이동할 수 없습니다. 대안 버튼을 사용해주세요.'
    showManualButton.value = true
  }
}

// Google Identity Services 콜백 함수
const handleCredentialResponse = async (response: any) => {
  try {
    errorMessage.value = ''
    console.log('Google Identity Services 응답:', response)
    
    // JWT 토큰 디코딩 (간단한 방법)
    const tokenParts = response.credential.split('.')
    const payload = JSON.parse(atob(tokenParts[1]))
    console.log('Google 토큰 페이로드:', payload)
    
    // 백엔드로 id_token 전송
    const result = await store.googleLogin(response.credential)
    
    if (!result.success) {
      errorMessage.value = result.error || 'Google 로그인에 실패했습니다.'
    }
  } catch (error) {
    console.error('Google 로그인 처리 실패:', error)
    errorMessage.value = 'Google 로그인 처리 중 오류가 발생했습니다.'
  }
}

// Google OAuth 콜백 처리
onMounted(() => {
  // 전역 함수로 등록 (Google Identity Services용)
  ;(window as any).handleCredentialResponse = handleCredentialResponse
  
  // Google Client ID 유효성 검사
  if (!googleClientId || googleClientId === 'YOUR_GOOGLE_CLIENT_ID') {
    console.error('Google Client ID가 설정되지 않았습니다.')
    errorMessage.value = 'Google Client ID가 설정되지 않았습니다. .env 파일을 확인해주세요.'
    showManualButton.value = true
    return
  }

  // Google Identity Services 스크립트 로드
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = () => {
    console.log('Google Identity Services 로드 완료')
  }
  script.onerror = () => {
    console.error('Google Identity Services 로드 실패')
    errorMessage.value = 'Google 로그인 서비스를 로드할 수 없습니다. 수동 로그인을 사용해주세요.'
    showManualButton.value = true
  }
  document.head.appendChild(script)
  
  // URL에서 id_token 파라미터 확인 (리디렉션 방식용)
  const urlParams = new URLSearchParams(window.location.search)
  const idToken = urlParams.get('id_token')
  const error = urlParams.get('error')
  
  if (error) {
    errorMessage.value = `Google 인증 실패: ${error}`
    return
  }
  
  if (idToken) {
    // Google 로그인 처리
    handleGoogleLogin(idToken)
  }
})

// Google 로그인 처리 함수
const handleGoogleLogin = async (idToken: string) => {
  try {
    errorMessage.value = ''
    console.log('Google ID Token 받음:', idToken.substring(0, 50) + '...')
    
    const result = await store.googleLogin(idToken)
    
    if (result.success) {
      console.log('구글 로그인 성공!')
      // router.push는 store에서 처리됨
    } else {
      errorMessage.value = result.error || 'Google 로그인에 실패했습니다.'
    }
  } catch (error) {
    console.error('Google 로그인 처리 실패:', error)
    errorMessage.value = 'Google 로그인 처리 중 오류가 발생했습니다.'
  }
}
</script>

<style scoped>
.login {
  max-width: 420px;
  margin: 4rem auto;
  padding: 2rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem 1rem;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #007bff;
  outline: none;
}

/* Base button style */
button {
  width: 100%;
  padding: 0.8rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Login button specific style */
button[type="submit"] {
  background-color: #007bff;
  color: white;
}

button[type="submit"]:hover {
  background-color: #0056b3;
}

.divider {
  text-align: center;
  margin: 2.5rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e0e0e0;
  z-index: 0;
}

.divider span {
  background-color: white;
  padding: 0 1rem;
  color: #7f8c8d;
  position: relative;
  z-index: 1;
}

/* Google login button specific style */
.google-login-btn {
  background-color: #ffffff;
  color: #333;
  border: 1px solid #dcdfe6;
}

.google-login-btn:hover {
  background-color: #f8f9fa;
  border-color: #c0c4cc;
}

.google-login-btn img {
  width: 20px;
  height: 20px;
}

/* Google Sign-In 버튼 스타일 */
#g_id_onload,
.g_id_signin {
  margin: 1rem 0;
}

/* 에러 메시지 스타일 */
.error-message {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 4px;
  color: #e53e3e;
  font-size: 0.9rem;
  text-align: center;
}

/* Google Identity Services 버튼 스타일 */
#g_id_onload,
.g_id_signin {
  margin: 1rem 0;
}

/* 수동 Google 로그인 버튼 스타일 */
.google-login-btn {
  margin-top: 1rem;
}
</style>