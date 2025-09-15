<script setup lang="ts">
import NavBar from './components/common/NavBar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <NavBar>
  </NavBar>
  <RouterView />
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
