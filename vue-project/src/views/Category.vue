<template>
  <main class="bg-white dark:bg-gray-900 transition-colors duration-300">
    <!-- Genre Category Section -->
    <div class="py-4 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              장르
            </h1>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <span class="ml-2 text-gray-600 dark:text-gray-400">장르를 불러오는 중...</span>
        </div>

        <!-- Genre Buttons -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <button 
            v-for="genre in displayGenres" 
            :key="genre.genre_id"
            class="genre-button group"
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()
const router = useRouter()
const isLoading = ref(true)

// 상위 5개 장르만 표시
const displayGenres = computed(() => categoryStore.popularGenres.slice(0, 5))

// 버튼 클릭 시 해당 장르 디테일 페이지로 이동
const handleGenreClick = (genre: any) => {
  router.push({ name: 'CategoryDetailView', params: { genreId: genre.genre_id } })
}

// 마운트 시 인기 장르 데이터 로드
onMounted(async () => {
  try {
    await categoryStore.fetchPopularGenres()
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.genre-button {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 120px;
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
  font-size: 18px;
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
</style>
