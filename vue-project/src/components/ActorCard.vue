<template>
  <RouterLink 
    :to="{ name: 'ActorDetail', params: { id: id } }" 
    class="flex flex-col items-center cursor-pointer group"
  >
    <!-- Actor Image -->
    <img 
      :src="image || spottiImage" 
      :alt="name" 
      class="w-30 h-30 rounded-full object-cover transition-transform duration-300 group-hover:scale-105" 
    />
    
    <!-- Actor Name -->
    <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-3 truncate max-w-30 text-center leading-relaxed tracking-wide" :title="name">
      {{ name }}
    </h3>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import spottiImage from '@/assets/spotti.png';

defineProps<{
  id: number;
  name: string;
  image?: string;
}>();
</script>
