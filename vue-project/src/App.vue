<template>
  <div class="app-wrapper">
  <NavBar>
  </NavBar>
  <RouterView />
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/common/NavBar.vue';
import { RouterView } from 'vue-router';
</script>


<style scoped>
.app-wrapper {
  padding-top: 59px;
}
.container {
  margin-top: 1rem;
}
</style>
