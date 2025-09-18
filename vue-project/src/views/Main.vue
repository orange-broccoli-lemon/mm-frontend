<template>
  <div class="main-container bg-white dark:bg-gray-900 transition-colors duration-300">
    <HotMovie />
    <Actor />
    <Category />
  </div>
</template>

<script setup lang="ts">
import HotMovie from '@/views/HotMovie.vue';
import Actor from '@/views/Actor.vue';
import Category from '@/views/Category.vue';
</script>

<style scoped>
/* HotMovie와 Actor 섹션 간 간격 줄이기 */
.main-container > * + * {
  margin-top: 0;
}
</style>