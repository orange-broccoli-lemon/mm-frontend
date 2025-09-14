<template>
  <main class="login">
    <h1>Login</h1>
    <form @submit.prevent="logInMember">
      <div class="form-group">
        <label for="username">ID</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="ID 입력"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="비밀번호 입력"
          required
        />
      </div>

      <button type="submit">로그인</button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAccountStore } from '../stores/user'

const store = useAccountStore()
const username = ref('')
const password = ref('')

const logInMember = () => {
  const userData = {
    username: username.value,
    password: password.value,
  }
  store.login(userData) 
}
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
}

button {
  padding: 0.7rem;
  width: 100%;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
