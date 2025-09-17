<template>
  <main class="bg-white dark:bg-gray-900 transition-colors duration-300">
    <!-- Movies Section -->
    <div class="py-4 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <!-- <span class="text-2xl">🔥</span> -->
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              인기 영화
            </h1>
          </div>
          <RouterLink 
            to="HotMovieDetailView"
            class="text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <span class="text-lg font-medium">+</span>
          </RouterLink>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <span class="ml-2 text-gray-600 dark:text-gray-400">영화를 불러오는 중...</span>
        </div>
        
        <!-- Movies Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <RouterLink
            v-for="(movie, index) in movieStore.popularMovies.slice(0,5)"
            :key="index"
            :to="{ name: 'BookDetail', params: { id: movie.movie_id } }"
            class="group transition-transform duration-200 hover:-translate-y-1"
          >
            <MovieCard
              :title="movie.title"
              :image="movie.poster_url"
              :movie_id="movie.movie_id"
            />
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useMovieStore } from "../stores/movie"
import MovieCard from "../components/MovieCard.vue"
import { RouterLink } from "vue-router"

const movieStore = useMovieStore()
const isLoading = ref(true)

onMounted(async () => {
  try {
    await movieStore.fetchPopularMovies()
  } finally {
    isLoading.value = false
  }
})

</script>
