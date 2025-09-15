<template>
  <nav class="navbar">
    <div class="navbar-left">
      <RouterLink to="/"><img src="@/assets/logo.png" alt="logo" class="logo"></RouterLink>
    </div>
    <div class="navbar-right">
      <div v-if="!accountStore.user">
        <RouterLink to="/signup">회원가입</RouterLink>
        <RouterLink to="/login">로그인</RouterLink>
      </div>
      <div v-else>
        <RouterLink to="/mypage">마이페이지</RouterLink>
        <button @click="logOut">로그아웃</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">

import { useAccountStore } from '@/stores/user';

const accountStore = useAccountStore()

const logOut = () => {
  accountStore.logOut()
}
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem; /* Reduced horizontal padding */
  position: fixed;
  top: 0;
  left: 0;
  right: 0; /* Use right: 0 instead of width: 100% */
  z-index: 1000;
  display: flex;
  align-items: center;
  box-sizing: border-box; /* Add box-sizing */
}

.navbar-left {
  margin-right: auto;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.navbar-right > div {
  display: flex;
  gap: 0.5rem; /* Reduced gap */
}

.logo {
  width: 40px;
  height: 40px;
  display: block;
}

.navbar a,
.navbar button {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem; /* Reduced padding */
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
  white-space: nowrap; /* Prevent text wrapping */
}

.navbar a:hover,
.navbar button:hover {
  background-color: #f0f0f0;
}

.navbar button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}
</style>