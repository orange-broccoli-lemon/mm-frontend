<template>
  <main class="bg-white dark:bg-gray-900 transition-colors duration-300">
    <!-- Movies Section -->
    <div class="py-4 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              인기 영화
            </h1>
          </div>
          <RouterLink 
            to="/hot-movie-detail"
            class="group relative w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
          >
            <span class="text-red-500 hover:text-red-600 text-xl font-bold group-hover:rotate-90 transition-all duration-300">+</span>
            <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              더보기
            </div>
          </RouterLink>
        </div>
        
        <!-- Loading State with Skeleton -->
        <div v-if="isLoading">
          <SkeletonLoader type="grid" :count="5" />
        </div>
        
        <!-- Movies Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <RouterLink
            v-for="(movie, index) in movieStore.popularMovies.slice(0,5)"
            :key="index"
            :to="{ name: 'movie-detail', params: { id: movie.movie_id } }"
            class="movie-card group transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-105"
            :style="{ animationDelay: `${index * 100}ms` }"
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
import { computed, onMounted } from "vue"
import { useMovieStore } from "../stores/movie.ts"
import MovieCard from "../components/MovieCard.vue"
import SkeletonLoader from "../components/common/SkeletonLoader.vue"
import { RouterLink } from "vue-router"

const movieStore = useMovieStore()

// store의 로딩 상태를 computed로 사용
const isLoading = computed(() => movieStore.isLoadingPopularMovies)

onMounted(async () => {
  await movieStore.fetchPopularMovies()
})

</script>

<style scoped>
/* Movie Card Entrance Animation */
.movie-card {
  opacity: 0;
  transform: translateY(30px);
  animation: slideInUp 0.6s ease-out forwards;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced hover effects */
.movie-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.dark .movie-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Section header animation */
.movie-card:nth-child(1) {
  animation-delay: 0ms;
}

.movie-card:nth-child(2) {
  animation-delay: 100ms;
}

.movie-card:nth-child(3) {
  animation-delay: 200ms;
}

.movie-card:nth-child(4) {
  animation-delay: 300ms;
}

.movie-card:nth-child(5) {
  animation-delay: 400ms;
}
</style>
