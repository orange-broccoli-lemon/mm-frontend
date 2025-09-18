<template>
  <main class="signup-container">
    <div class="signup-card">
      <div class="signup-header">
        <h1 class="signup-title">회원가입</h1>
        <p class="signup-subtitle">새로운 계정을 만들어보세요</p>
      </div>
      
      <form @submit.prevent="signUpMember" class="signup-form">
      <div class="form-group">
        <label for="name">이름 <span class="required">*</span></label>
        <input
          id="name"
          v-model="name"
          type="text"
          placeholder="이름 입력"
          required
          @blur="validateName"
        />
        <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
      </div>

      <div class="form-group">
        <label for="email">이메일 <span class="required">*</span></label>
        <input
          id="email"
          v-model="email"
          type="text"
          placeholder="이메일 입력"
          required
          @blur="validateEmail"
        />
        <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
      </div>

      <div class="form-group">
        <label for="password1">비밀번호 <span class="required">*</span></label>
        <input
          id="password1"
          v-model="password1"
          type="password"
          placeholder="비밀번호 입력"
          required
          @blur="validatePassword"
        />
        <div v-if="errors.password1" class="error-message">{{ errors.password1 }}</div>
      </div>

      <div class="form-group">
        <label for="password2">비밀번호 확인 <span class="required">*</span></label>
        <input
          id="password2"
          v-model="password2"
          type="password"
          placeholder="비밀번호 재입력"
          required
          @blur="validatePasswordConfirm"
        />
        <div v-if="errors.password2" class="error-message">{{ errors.password2 }}</div>
      </div>

        <button type="submit" :disabled="!isFormValid" class="submit-button">
          회원가입
        </button>
      </form>
      
      <div class="signup-footer">
        <p>이미 계정이 있으신가요? 
          <RouterLink to="/login" class="login-link">로그인</RouterLink>
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { RouterLink } from "vue-router"
import { useAccountStore } from "../stores/user"
import spottiImage from '@/assets/spotti.png'

const store = useAccountStore()

const name = ref("")
const password1 = ref("")
const password2 = ref("")
const email = ref("")
const image = ref("")

// 에러 메시지를 저장할 객체
const errors = ref({
  name: "",
  email: "",
  password1: "",
  password2: "",
  image: ""
})

// 이름 검증
const validateName = () => {
  if (!name.value.trim()) {
    errors.value.name = "이름을 입력해주세요."
    return false
  }
  if (name.value.length < 2) {
    errors.value.name = "이름은 2자 이상 입력해주세요."
    return false
  }
  if (name.value.length > 20) {
    errors.value.name = "이름은 20자 이하로 입력해주세요."
    return false
  }
  if (!/^[가-힣a-zA-Z\s]+$/.test(name.value)) {
    errors.value.name = "이름은 한글, 영문, 공백만 입력 가능합니다."
    return false
  }
  errors.value.name = ""
  return true
}

// 이메일 검증
const validateEmail = () => {
  if (!email.value.trim()) {
    errors.value.email = "이메일을 입력해주세요."
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errors.value.email = "올바른 이메일 형식을 입력해주세요."
    return false
  }
  errors.value.email = ""
  return true
}

// 비밀번호 검증
const validatePassword = () => {
  if (!password1.value) {
    errors.value.password1 = "비밀번호를 입력해주세요."
    return false
  }
  if (password1.value.length < 8) {
    errors.value.password1 = "비밀번호는 8자 이상 입력해주세요."
    return false
  }
  if (password1.value.length > 20) {
    errors.value.password1 = "비밀번호는 20자 이하로 입력해주세요."
    return false
  }
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password1.value)) {
    errors.value.password1 = "비밀번호는 영문과 숫자를 포함해야 합니다."
    return false
  }
  errors.value.password1 = ""
  return true
}

// 비밀번호 확인 검증
const validatePasswordConfirm = () => {
  if (!password2.value) {
    errors.value.password2 = "비밀번호 확인을 입력해주세요."
    return false
  }
  if (password1.value !== password2.value) {
    errors.value.password2 = "비밀번호가 일치하지 않습니다."
    return false
  }
  errors.value.password2 = ""
  return true
}

// 이미지 URL 검증 (선택사항)
const validateImageUrl = () => {
  if (image.value && image.value.trim()) {
    const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i
    if (!urlRegex.test(image.value)) {
      errors.value.image = "올바른 이미지 URL을 입력해주세요. (jpg, jpeg, png, gif, webp)"
      return false
    }
  }
  errors.value.image = ""
  return true
}

// 전체 양식 유효성 검사
const isFormValid = computed(() => {
  return validateName() && 
         validateEmail() && 
         validatePassword() && 
         validatePasswordConfirm() && 
         validateImageUrl() &&
         name.value.trim() !== "" &&
         email.value.trim() !== "" &&
         password1.value !== "" &&
         password2.value !== ""
})

const signUpMember = function () {
  // 모든 검증 실행
  const isNameValid = validateName()
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  const isPasswordConfirmValid = validatePasswordConfirm()
  const isImageValid = validateImageUrl()

  if (!isNameValid || !isEmailValid || !isPasswordValid || !isPasswordConfirmValid || !isImageValid) {
    alert("입력 정보를 확인해주세요.")
    return
  }

  const userData = {
    name: name.value.trim(),
    password: password1.value,
    email: email.value.trim(),
    profile_image_url: image.value.trim() || spottiImage
  }

  store.signUp(userData)
}
</script>

<style scoped>
/* 메인 컨테이너 */
.signup-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 2rem 1rem;
  font-family: "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  transition: background-color 0.3s ease;
}

.dark .signup-container {
  background: #1a202c;
}

/* 카드 스타일 */
.signup-card {
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

.dark .signup-card {
  background: #2d3748;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.signup-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

/* 헤더 */
.signup-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.signup-title {
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

.dark .signup-title {
  color: #e2e8f0;
}

.signup-subtitle {
  color: #718096;
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
  transition: color 0.3s ease;
}

.dark .signup-subtitle {
  color: #a0aec0;
}

/* 폼 */
.signup-form {
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

input.error {
  border-color: #e53e3e;
  background: #fed7d7;
}

input.error:focus {
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  min-height: 1.25rem;
  font-weight: 500;
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

.submit-button:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 푸터 */
.signup-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  transition: border-color 0.3s ease;
}

.dark .signup-footer {
  border-color: #4a5568;
}

.signup-footer p {
  color: #718096;
  margin: 0;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.dark .signup-footer p {
  color: #a0aec0;
}

.login-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link:hover {
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
  .signup-container {
    padding: 1rem;
  }
  
  .signup-card {
    padding: 2rem 1.5rem;
    border-radius: 16px;
  }
  
  .signup-title {
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

.signup-card {
  animation: fadeInUp 0.6s ease-out;
}
</style>
