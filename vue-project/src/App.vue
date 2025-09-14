<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { useAccountStore } from './stores/user'
import { computed } from 'vue'

const accountStore = useAccountStore()

const isLoggedIn = computed(() => !!accountStore.user) 
</script>

<template>
<<<<<<< HEAD
  <nav class="navbar">
    <div class="login-a">
      <RouterLink to="/">메인</RouterLink>

      <template v-if="!isLoggedIn">
=======
    <nav class="navbar">
      <div class="login-a">
        <RouterLink to="/">메인</RouterLink>
        <RouterLink to="/community">커뮤니티</RouterLink>
>>>>>>> sangrae
        <RouterLink to="/signup">회원가입</RouterLink>
        <RouterLink to="/login">로그인</RouterLink>
      </template>

      <template v-else>
        <RouterLink to="/mypage">마이페이지</RouterLink>
      </template>
    </div>
  </nav>

  <div class="page-content">
    <RouterView />
  </div>
</template>

<style scoped>
.navbar {
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between; 
  align-items: center;
  padding: 2rem 2rem;
  background-color: #f8f8f8;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
}

.login-a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  display: flex;
  gap: 1rem;
}

.page-content {
  padding-top: 4rem;
}
</style>
