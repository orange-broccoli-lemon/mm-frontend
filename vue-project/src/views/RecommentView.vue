<template>
  <main class="bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="py-4 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              내 추천 영화
            </h1>
            
        </div>
    </div>
        <!-- Movies Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <RouterLink
            v-for="(movie, index) in userStore.recommendedMovies?.slice(0,5)"
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
import { useAccountStore } from "@/stores/user.ts"
import MovieCard from "../components/MovieCard.vue"
import SkeletonLoader from "../components/common/SkeletonLoader.vue"
import { RouterLink } from "vue-router"

const movieStore = useMovieStore()
const userStore = useAccountStore()

// store의 로딩 상태를 computed로 사용

onMounted(async () => {
  const result = await userStore.getRecommendedMovie()
  console.log("리턴값:", result)                       
  console.log("스토어 상태:", userStore.recommendedMovies)
  console.log("스토어 배열:", userStore.recommendedMovies?.map(m => m.title))
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
