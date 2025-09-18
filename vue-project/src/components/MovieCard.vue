<script setup lang="ts">
defineProps<{
  title: string;
  image: string;
}>();
</script>

<template>
  <div class="movie-card bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <!-- Image Container -->
    <div class="aspect-[2/3] overflow-hidden relative">
      <img
        :src="image"
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />
      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    
    <!-- Card Content -->
    <div class="p-4 h-16 flex items-center">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-relaxed tracking-wide w-full transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {{ title }}
      </h3>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Ensure consistent card height */
.movie-card > div:first-child {
  flex-shrink: 0;
}

.movie-card > div:last-child {
  flex-shrink: 0;
  min-height: 4rem; /* h-16 equivalent */
}

/* Enhanced hover effects */
.movie-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.dark .movie-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Enhanced line clamp for better text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  hyphens: auto;
}
</style>
