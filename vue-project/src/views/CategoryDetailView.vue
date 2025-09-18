<template>
  <main class="bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
    <div class="py-6 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        
        <!-- Header -->
        <div class="flex items-center gap-3 mb-8">
          <button 
            @click="goBack"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="뒤로가기"
          >
            <svg class="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {{ selectedGenre?.name || '장르' }} 영화
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              총 {{ movies.length }}편의 영화
            </p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 text-gray-600 dark:text-gray-400">
          <div class="animate-spin rounded-full h-12 w-12 border-2 border-gray-400 border-t-transparent mb-4"></div>
          <span>영화를 불러오는 중...</span>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center py-16 text-center">
          <svg class="w-14 h-14 text-red-500 dark:text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">영화를 불러올 수 없습니다</h3>
          <p class="text-gray-500 dark:text-gray-400">{{ error }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="movies.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <svg class="w-14 h-14 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM6 6v12h12V6H6z"/>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">영화가 없습니다</h3>
          <p class="text-gray-500 dark:text-gray-400">이 장르에는 아직 영화가 등록되지 않았습니다.</p>
        </div>

        <!-- Movies Grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          <RouterLink
            v-for="movie in movies"
            :key="movie.movie_id"
            :to="{ name: 'movie-detail', params: { id: movie.movie_id } }"
            class="group transition-transform duration-200 hover:-translate-y-1"
          >
            <MovieCard
              :title="movie.title"
              :image="movie.poster_url"
              :movie_id="movie.movie_id"
            />
          </RouterLink>
        </div>

        <!-- Load More Button -->
        <div v-if="!isLoading && movies.length > 0 && hasMore" class="flex justify-center mt-12">
          <button 
            @click="loadMore"
            :disabled="isLoadingMore"
            class="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isLoadingMore">로딩 중...</span>
            <span v-else>더 보기</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCategoryStore } from '@/stores/category'
import MovieCard from '@/components/MovieCard.vue'

const router = useRouter()
const route = useRoute()
const categoryStore = useCategoryStore()

const isLoading = ref(true)
const isLoadingMore = ref(false)
const error = ref<string | null>(null)
const hasMore = ref(false)
const currentPage = ref(1)

// route.params에서 genreId를 안전하게 숫자로 변환
const genreId = computed(() => parseInt(route.params.genreId as string, 10) || 0)

// 선택된 장르
const selectedGenre = computed(() => categoryStore.getGenreById(genreId.value))

// 영화 목록
const movies = computed(() => categoryStore.getMoviesByGenre(genreId.value))

// 장르별 영화 가져오기
const fetchMoviesByGenre = async (page = 1) => {
  if (!genreId.value || genreId.value <= 0) return

  if (page === 1) isLoading.value = true
  else isLoadingMore.value = true

  error.value = null

  try {
    const response = await categoryStore.fetchMoviesByGenre(genreId.value, page)
    hasMore.value = response.hasMore || false
    currentPage.value = page
  } catch (err) {
    error.value = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

const loadMore = () => {
  if (!isLoadingMore.value && hasMore.value) {
    fetchMoviesByGenre(currentPage.value + 1)
  }
}

const goBack = () => router.back()

// route.params.genreId 변경 시 새로 불러오기
watch(() => route.params.genreId, () => {
  currentPage.value = 1
  hasMore.value = false
  fetchMoviesByGenre()
})

onMounted(async () => {
  if (!categoryStore.isPopularGenresLoaded) {
    await categoryStore.fetchPopularGenres()
  }
  fetchMoviesByGenre()
})
</script>
