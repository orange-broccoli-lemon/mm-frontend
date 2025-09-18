<template>
  <main class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="login-title">로그인</h1>
        <p class="login-subtitle">계정에 로그인하세요</p>
      </div>
      
      <!-- 일반 로그인 폼 -->
      <form @submit.prevent="logInMember" class="login-form">
        <div class="form-group">
          <label for="username">이메일 <span class="required">*</span></label>
          <input id="username" v-model="username" type="text" placeholder="이메일 입력" required />
        </div>

        <div class="form-group">
          <label for="password">비밀번호 <span class="required">*</span></label>
          <input id="password" v-model="password" type="password" placeholder="비밀번호 입력" required />
        </div>

        <button type="submit" class="submit-button">로그인</button>
      </form>

      <div class="divider"><span>또는</span></div>

      <!-- Google Identity Services 로그인 버튼 -->
      <div class="google-section">
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
      </div>

      <!-- 에러 메시지 표시 -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div class="login-footer">
        <p>계정이 없으신가요? 
          <RouterLink to="/signup" class="signup-link">회원가입</RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
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
/* 메인 컨테이너 */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem 1rem;
  font-family: "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: background-color 0.3s ease;
}

.dark .login-container {
  background: #1a202c;
}

/* 카드 스타일 */
.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.dark .login-card {
  background: #2d3748;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

/* 헤더 */
.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: color 0.3s ease;
}

.dark .login-title {
  color: #e2e8f0;
}

.login-subtitle {
  color: #718096;
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
  transition: color 0.3s ease;
}

.dark .login-subtitle {
  color: #a0aec0;
}

/* 폼 */
.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.dark label {
  color: #e2e8f0;
}

input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;
  box-sizing: border-box;
  color: #2d3748;
}

.dark input {
  background: #4a5568;
  border-color: #4a5568;
  color: #e2e8f0;
}

input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.dark input:focus {
  background: #4a5568;
  border-color: #667eea;
}

input:hover {
  border-color: #cbd5e0;
  background: white;
}

.dark input:hover {
  background: #4a5568;
  border-color: #718096;
}

/* 버튼 */
.submit-button {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.submit-button:hover:not(:disabled)::before {
  left: 100%;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

/* 구분선 */
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
  background-color: #e2e8f0;
  z-index: 0;
}

.dark .divider::before {
  background-color: #4a5568;
}

.divider span {
  background-color: white;
  padding: 0 1rem;
  color: #718096;
  position: relative;
  z-index: 1;
  font-size: 0.9rem;
}

.dark .divider span {
  background-color: #2d3748;
  color: #a0aec0;
}

/* Google 섹션 */
.google-section {
  margin-bottom: 2rem;
}

/* Google 로그인 버튼 */
.google-login-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: white;
  color: #333;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.dark .google-login-btn {
  background: #4a5568;
  border-color: #4a5568;
  color: #e2e8f0;
}

.google-login-btn:hover {
  background: #f8f9fa;
  border-color: #cbd5e0;
  transform: translateY(-1px);
}

.dark .google-login-btn:hover {
  background: #5a6578;
  border-color: #718096;
}

.google-login-btn img {
  width: 20px;
  height: 20px;
}

/* Google Identity Services 버튼 스타일 */
#g_id_onload,
.g_id_signin {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}

/* 에러 메시지 */
.error-message {
  margin: 1rem 0;
  padding: 1rem 1.25rem;
  background-color: #fed7d7;
  border: 2px solid #feb2b2;
  border-radius: 12px;
  color: #e53e3e;
  font-size: 0.9rem;
  text-align: center;
  font-weight: 500;
}

.dark .error-message {
  background-color: #742a2a;
  border-color: #9c1a1a;
  color: #feb2b2;
}

/* 푸터 */
.login-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  transition: border-color 0.3s ease;
}

.dark .login-footer {
  border-color: #4a5568;
}

.login-footer p {
  color: #718096;
  margin: 0;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.dark .login-footer p {
  color: #a0aec0;
}

.signup-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* 필수 표시 */
.required {
  color: #e53e3e;
  font-weight: bold;
  margin-left: 2px;
}

/* 반응형 디자인 */
@media (max-width: 640px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }
  
  .login-title {
    font-size: 2rem;
  }
  
  input {
    padding: 0.875rem 1rem;
  }
  
  .submit-button {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
}

/* 애니메이션 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-card {
  animation: fadeInUp 0.6s ease-out;
}
</style>