<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
    <nav class="navbar">
      <div class="login-a">
        <RouterLink to="/">메인</RouterLink>
        <RouterLink to="/community">커뮤니티</RouterLink>
        <RouterLink to="/signup">회원가입</RouterLink>
        <RouterLink to="/login">로그인</RouterLink>
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
}

.page-content {
  padding-top: 4rem;
}

</style>
