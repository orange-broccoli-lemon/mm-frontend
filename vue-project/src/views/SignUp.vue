<template>
  <main class="signup">
    <h1>회원가입</h1>
    <form @submit.prevent="signUpMember">
      <div class="form-group">
        <label for="username">아이디</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="아이디 입력"
          required
        />
      </div>
      <div class="form-group">
      <label for="email">이메일</label>
        <input
          id="email"
          v-model="email"
          type="text"
          placeholder="이메일 입력"
          required
        />
      </div>
      <div class="form-group">
        <label for="password1">비밀번호</label>
        <input
          id="password1"
          v-model="password1"
          type="password"
          placeholder="비밀번호 입력"
          required
        />
      </div>

      <div class="form-group">
        <label for="password2">비밀번호 확인</label>
        <input
          id="password2"
          v-model="password2"
          type="password"
          placeholder="비밀번호 재입력"
          required
        />
      </div>

      <button type="submit">회원가입</button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useAccountStore } from "../stores/user"

const store = useAccountStore()

const username = ref("")
const password1 = ref("")
const password2 = ref("")
const email = ref("")

const signUpMember = function () {
  const userData = new FormData()
  userData.append("username", username.value)
  userData.append("password1", password1.value)
  userData.append("password2", password2.value)
  userData.append("email", email.value)
  store.signUp(userData)

}


// 유저 이름 중복 방지를 위해 중복확인 API 요청 응답 값 BOOL front에서하면 부하 

</script>

<style scoped>
.signup {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8pxa;
}

.form-group {
  margin-bottom: 1rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.3rem;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.7rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
