<template>
  <main class="bg-white dark:bg-gray-900 transition-colors duration-300">
    <!-- Genre Category Section -->
    <div class="py-4 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="flex items-baseline justify-between mb-6 section-header">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              인기 장르
            </h1>
          </div>
          <RouterLink 
            :to="{ name: 'category-all'}"
            class="group relative w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
            >
            <span class="text-green-500 hover:text-green-600 text-xl font-bold group-hover:rotate-90 transition-all duration-300">+</span>
            <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              더보기
            </div>
          </RouterLink>
        </div>

        <!-- Loading State with Skeleton -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div 
            v-for="n in 5" 
            :key="n" 
            class="skeleton-genre-button"
          >
            <div class="skeleton-genre-text"></div>
          </div>
        </div>

        <!-- Genre Buttons -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <button 
            v-for="(genre, index) in displayGenres" 
            :key="genre.genre_id"
            class="genre-button group genre-card"
            :style="{ animationDelay: `${index * 100}ms` }"
            @click="handleGenreClick(genre)"
          >
            <span class="genre-name">{{ genre.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()
const router = useRouter()

// store의 로딩 상태를 computed로 사용
const isLoading = computed(() => categoryStore.isLoadingPopularGenres)

// 상위 5개 장르만 표시
const displayGenres = computed(() => categoryStore.popularGenres.slice(0, 5))

// 버튼 클릭 시 해당 장르 디테일 페이지로 이동
const handleGenreClick = (genre: any) => {
  router.push({ name: 'category-detail', params: { genreId: genre.genre_id } })
}

// 마운트 시 인기 장르 데이터 로드
onMounted(async () => {
  await categoryStore.fetchPopularGenres()
})
</script>

<style scoped>
.genre-button {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 80px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.genre-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #d1d5db;
}
.genre-button:active {
  transform: translateY(0);
}
.genre-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
}
.movie-count {
  font-size: 14px;
  color: #6b7280;
}
/* 다크모드 지원 */
.dark .genre-button {
  background: #374151;
  border-color: #4b5563;
}
.dark .genre-name {
  color: #f9fafb;
}
.dark .movie-count {
  color: #d1d5db;
}
.dark .genre-button:hover {
  border-color: #6b7280;
}

/* Skeleton Styles */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton-genre-button {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-genre-text {
  width: 60%;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.dark .skeleton-genre-button {
  background: #374151;
  border-color: #4b5563;
}

.dark .skeleton-genre-text {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200px 100%;
}

/* Section Header Animation */
.section-header {
  opacity: 0;
  transform: translateY(-20px);
  animation: slideInDown 0.8s ease-out forwards;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Genre Card Entrance Animation */
.genre-card {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
  animation: genreSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes genreSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Staggered animation delays */
.genre-card:nth-child(1) {
  animation-delay: 0ms;
}

.genre-card:nth-child(2) {
  animation-delay: 100ms;
}

.genre-card:nth-child(3) {
  animation-delay: 200ms;
}

.genre-card:nth-child(4) {
  animation-delay: 300ms;
}

.genre-card:nth-child(5) {
  animation-delay: 400ms;
}
</style>
