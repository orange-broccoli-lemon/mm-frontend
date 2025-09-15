<template>
  <nav class="navbar">
    <div class="login-a">
      <RouterLink to="/">메인</RouterLink>

      <div v-if="!isLoggedIn">
        <RouterLink to="/signup">회원가입</RouterLink>
        <RouterLink to="/login">로그인</RouterLink>
      </div>
      
      <div v-else>
        <RouterLink to="/mypage">마이페이지</RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">

import { useAccountStore } from '@/stores/user';
import { computed } from 'vue';

const accountStore = useAccountStore()
const isLoggedIn = computed(() => !!accountStore.user) 
</script>

<style>

</style>