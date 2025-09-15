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

      <div class="form-group">
        <label for="image">이미지 URL</label>
        <input
          id="image"
          v-model="image"
          type="text"
          placeholder="이미지 URL 입력"
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

const name = ref("")
const password1 = ref("")
const password2 = ref("")
const email = ref("")
const image = ref("")

const signUpMember = function () {
  if (password1.value !== password2.value) {
    alert("비밀번호가 일치하지 않습니다.")
    return
  }
  const userData = {
    name: name.value,
    password: password1.value,
    email: email.value,
    profile_image_url: image.value
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
