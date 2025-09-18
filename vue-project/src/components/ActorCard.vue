<template>
  <RouterLink 
    :to="{ name: 'actor-detail', params: { id: id } }" 
    class="flex flex-col items-center cursor-pointer group transform transition-all duration-300 hover:-translate-y-2 hover:scale-105"
  >
    <!-- Actor Image Container -->
    <div class="relative overflow-hidden rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-300">
      <img 
        :src="image || spottiImage" 
        :alt="name" 
        class="w-30 h-30 rounded-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      <!-- Shine Effect -->
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
    </div>
    
    <!-- Actor Name -->
    <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-3 truncate max-w-30 text-center leading-relaxed tracking-wide transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" :title="name">
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
