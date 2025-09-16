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

    <!-- 구글 로그인 버튼 -->
    
      <button class="google-login-btn" @click="redirectToGoogle">
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="G" width="20" />
      Google 계정으로 로그인
    </button>


    
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAccountStore } from '../stores/user'

const store = useAccountStore()
const username = ref('')
const password = ref('')
const googleLoginUrl = ref('')

// 일반 로그인 처리
const logInMember = () => {
  const userData = {
    email: username.value,
    password: password.value,
  }
  store.login(userData)
}

// 구글 로그인 URL 요청
const fetchGoogleLoginUrl = async () => {
  try {
    const res = await axios.get('https://i13m105.p.ssafy.io/api/v1/auth/google/login')
    if (res.data && res.data.url) {
      googleLoginUrl.value = res.data.url
    } else {
      console.error('서버에서 유효한 URL을 반환하지 않았습니다.')
    }
  } catch (err) {
    console.error('Google 로그인 URL 요청 실패', err)
  }
}

// 버튼 클릭 시 리디렉션
const redirectToGoogle = () => {
  if (googleLoginUrl.value) {
    window.location.href = googleLoginUrl.value
  }
}

onMounted(() => {
  fetchGoogleLoginUrl()
})
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
</style>