<script setup lang="ts">
defineProps<{
  title: string;
  image: string;
}>();
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group cursor-pointer transition-all duration-200 hover:scale-105">
    <!-- Image Container -->
    <div class="aspect-[2/3] overflow-hidden">
      <img
        :src="image"
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
    </div>
    
    <!-- Card Content -->
    <div class="p-3">
      <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight">
        {{ title }}
      </h3>
    </div>
  </div>
</template>

