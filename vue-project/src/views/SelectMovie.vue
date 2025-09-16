<template>
  <div class="min-h-screen bg-white">
    <!-- Header Section -->
    <div class="bg-gray-50 py-8 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center gap-3 mb-4">
          <button @click="goBack" class="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200">
            <svg class="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="text-2xl font-semibold text-gray-900">영화 선택</h1>
        </div>
        <p class="text-gray-600">리뷰를 작성할 영화를 선택해주세요</p>
      </div>
    </div>

    <!-- Search Section -->
    <div class="py-6 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="relative mb-6">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="영화 제목으로 검색..."
            class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
            @input="searchMovies"
          />
          <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="text-gray-500">영화 목록을 불러오는 중...</div>
        </div>

        <!-- Movies Grid -->
        <div v-else-if="filteredMovies.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div
            v-for="movie in filteredMovies"
            :key="movie.movie_id"
            @click="() => { console.log('영화 클릭됨:', movie); selectMovie(movie); }"
            class="group cursor-pointer transition-all duration-200 hover:scale-105"
          >
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="aspect-[2/3] overflow-hidden">
                <img
                  :src="movie.poster_url"
                  :alt="movie.title"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div class="p-3">
                <h3 class="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                  {{ movie.title }}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-12">
          <div class="text-4xl mb-4">🎬</div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
          <p class="text-gray-600">다른 검색어로 시도해보세요</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '../stores/movie'

const router = useRouter()
const movieStore = useMovieStore()

const searchQuery = ref('')
const isLoading = ref(false)
const filteredMovies = ref<any[]>([])

const goBack = () => {
  router.back()
}

const searchMovies = async () => {
  if (searchQuery.value.trim().length < 2) {
    filteredMovies.value = []
    return
  }

  isLoading.value = true
  try {
    // 영화 검색 API 호출 (실제 API가 있다면 사용)
    // 임시로 인기 영화 목록에서 필터링
    await movieStore.fetchPopularMovies()
    filteredMovies.value = movieStore.popularMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  } catch (error) {
    console.error('영화 검색 실패:', error)
  } finally {
    isLoading.value = false
  }
}

const selectMovie = (movie: any) => {
  console.log('=== 영화 선택 디버깅 ===')
  console.log('전체 영화 객체:', movie)
  console.log('영화 ID:', movie.movie_id)
  console.log('영화 제목:', movie.title)
  console.log('포스터 URL:', movie.poster_url)
  console.log('포스터 URL 타입:', typeof movie.poster_url)
  console.log('포스터 URL 길이:', movie.poster_url?.length)
  console.log('포스터 URL이 null인가:', movie.poster_url === null)
  console.log('포스터 URL이 undefined인가:', movie.poster_url === undefined)
  console.log('포스터 URL이 빈 문자열인가:', movie.poster_url === '')
  
  // 영화 객체의 모든 키 확인
  console.log('영화 객체의 모든 키:', Object.keys(movie))
  
  const queryParams = {
    movieId: movie.movie_id,
    movieTitle: movie.title,
    poster_url: encodeURIComponent(movie.poster_url || '')
  }
  
  console.log('전달할 쿼리 파라미터:', queryParams)
  console.log('========================')
  
  // 영화 선택 후 리뷰 작성 페이지로 이동
  router.push({
    name: 'CreateReview',
    query: queryParams
  })
}

onMounted(async () => {
  // 초기 로드 시 인기 영화 목록 표시
  try {
    isLoading.value = true
    console.log('영화 목록 로드 시작...')
    await movieStore.fetchPopularMovies()
    console.log('영화 목록 로드 완료:', movieStore.popularMovies)
    filteredMovies.value = movieStore.popularMovies.slice(0, 20) // 처음 20개만 표시
    console.log('필터된 영화 목록:', filteredMovies.value)
  } catch (error) {
    console.error('영화 목록 로드 실패:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
