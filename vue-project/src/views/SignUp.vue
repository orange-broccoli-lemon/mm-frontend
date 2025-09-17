<template>
  <main class="signup">
    <h1>회원가입</h1>
    <form @submit.prevent="signUpMember">
      <div class="form-group">
        <label for="name">이름</label>
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
        <label for="email">이메일</label>
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
        <label for="password1">비밀번호</label>
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
        <label for="password2">비밀번호 확인</label>
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

      <div class="form-group">
        <label for="image">이미지 URL</label>
        <input
          id="image"
          v-model="image"
          type="text"
          placeholder="이미지 URL 입력"
          @blur="validateImageUrl"
        />
        <div v-if="errors.image" class="error-message">{{ errors.image }}</div>
      </div>

      <button type="submit" :disabled="!isFormValid">회원가입</button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
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
.signup {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

input.error {
  border-color: #dc3545;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  min-height: 1.25rem;
}

button {
  width: 100%;
  padding: 0.7rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
