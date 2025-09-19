<template>
  <main class="bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="py-4 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-6 animate-fade-in">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full animate-scale-in"></div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight animate-slide-in-right">
              내 추천 영화
            </h1>
            
        </div>
    </div>
        
        <!-- Loading State with Skeleton -->
        <div v-if="isLoading">
          <SkeletonLoader type="grid" :count="5" />
        </div>
        
        <!-- Movies Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 animate-slide-up-delayed">
          <RouterLink
            v-for="(movie, index) in userStore.recommendedMovies?.slice(0,5)"
            :key="index"
            :to="{ name: 'movie-detail', params: { id: movie.movie_id } }"
            class="movie-card group transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-105 animate-bounce-in"
            :style="{ animationDelay: `${(index * 100) + 400}ms` }"
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
import { useMovieStore } from "../stores/movie.ts"
import { useAccountStore } from "@/stores/user.ts"
import MovieCard from "../components/MovieCard.vue"
import SkeletonLoader from "../components/common/SkeletonLoader.vue"
import { RouterLink } from "vue-router"

const movieStore = useMovieStore()
const userStore = useAccountStore()

// 로딩 상태 관리
const isLoading = ref(true)

onMounted(async () => {
  try {
    isLoading.value = true
    const result = await userStore.getRecommendedMovie()
    console.log("리턴값:", result)                       
    console.log("스토어 상태:", userStore.recommendedMovies)
    console.log("스토어 배열:", userStore.recommendedMovies?.map(m => m.title))
  } finally {
    isLoading.value = false
  }
})

</script>

<style scoped>
/* 애니메이션 효과 - 마이페이지와 동일 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(-50px);
  }
  50% {
    opacity: 1;
    transform: scale(1.05) translateY(0);
  }
  70% {
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 애니메이션 클래스 */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out 0.2s both;
}

.animate-scale-in {
  animation: scaleIn 0.6s ease-out 0.4s both;
}

.animate-slide-in-right {
  animation: slideInRight 0.8s ease-out 0.6s both;
}

.animate-slide-up-delayed {
  animation: slideUp 0.8s ease-out 1.0s both;
}

.animate-bounce-in {
  animation: bounceIn 0.8s ease-out 0.6s both;
}

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
</style>
