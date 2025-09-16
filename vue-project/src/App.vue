<template>
  <div class="app-wrapper bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
    <NavBar />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/common/NavBar.vue';
import { RouterView } from 'vue-router';
</script>


<style scoped>
.app-wrapper {
  padding-top: 4rem; /* 64px - 네비게이션 바 높이 (h-16) */
}
.container {
  margin-top: 1rem;
}
</style>
