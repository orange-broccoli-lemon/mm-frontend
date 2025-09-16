<script setup lang="ts">
defineProps<{
  title: string;
  image: string;
}>();
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 group cursor-pointer">
    <!-- Image Container -->
    <div class="relative overflow-hidden h-64">
      <img 
        :src="image" 
        :alt="title" 
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
      />
      <!-- Simple Overlay -->
      <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <div class="bg-white dark:bg-gray-800 rounded-full p-3">
          <svg class="w-5 h-5 text-gray-800 dark:text-gray-200 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Card Content -->
    <div class="p-3">
      <h3 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-1 truncate leading-tight" :title="title">
        {{ title }}
      </h3>
      <div class="flex items-center justify-between">
        <span class="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs font-medium">
          <span>⭐</span>
          인기
        </span>
        <div class="text-gray-500 dark:text-gray-400 text-xs">
          상세보기
        </div>
      </div>
    </div>
  </div>
</template>

