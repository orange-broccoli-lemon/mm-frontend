<template>
  <div class="youtube-videos bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="py-4 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- 헤더 -->
        <div class="mb-6">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              영화 관련 영상
            </h2>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm ml-4">
            YouTube에서 영화 관련 인기 영상을 확인해보세요
          </p>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 3" :key="n" class="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div class="skeleton-thumbnail"></div>
            <div class="p-4 space-y-3">
              <div class="skeleton-title"></div>
              <div class="skeleton-channel"></div>
              <div class="skeleton-description"></div>
              <div class="skeleton-button"></div>
            </div>
          </div>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchVideos" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            다시 시도
          </button>
        </div>

        <!-- 영상 목록 -->
        <div v-else-if="videos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="video in videos" :key="video.id.videoId" class="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <a :href="`https://www.youtube.com/watch?v=${video.id.videoId}`" target="_blank" rel="noopener noreferrer" class="block">
              <img :src="video.snippet.thumbnails.high.url" :alt="video.snippet.title" class="w-full h-48 object-cover" />
            </a>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                <a :href="`https://www.youtube.com/watch?v=${video.id.videoId}`" target="_blank" rel="noopener noreferrer" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {{ video.snippet.title }}
                </a>
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">{{ video.snippet.channelTitle }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ video.snippet.description }}</p>
              <a :href="`https://www.youtube.com/watch?v=${video.id.videoId}`" target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                YouTube에서 보기
                <svg class="ml-2 -mr-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
              </a>
            </div>
          </div>
        </div>

        <!-- 빈 상태 -->
        <div v-else class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">📺</div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">영상을 찾을 수 없습니다</h3>
          <p class="text-gray-600 dark:text-gray-400">다른 키워드로 검색해보세요</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// YouTube API 설정
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY'
const SEARCH_QUERY = '영화 리뷰' // 검색 키워드
const MAX_RESULTS = 5

// 반응형 데이터
const videos = ref<any[]>([])
const loading = ref(false)
const error = ref('')

// YouTube API 호출 함수
const fetchVideos = async () => {
  if (!API_KEY || API_KEY === 'YOUR_YOUTUBE_API_KEY') {
    error.value = 'YouTube API 키가 설정되지 않았습니다.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: SEARCH_QUERY,
        type: 'video',
        maxResults: MAX_RESULTS,
        order: 'relevance',
        key: API_KEY
      }
    })

    videos.value = response.data.items || []
  } catch (err: any) {
    console.error('YouTube API 오류:', err)
    if (err.response?.status === 403) {
      error.value = 'API 키가 유효하지 않거나 할당량이 초과되었습니다.'
    } else if (err.response?.status === 400) {
      error.value = '잘못된 요청입니다. API 키를 확인해주세요.'
    } else {
      error.value = '영상을 불러오는 중 오류가 발생했습니다.'
    }
  } finally {
    loading.value = false
  }
}

// 컴포넌트 마운트 시 API 호출
onMounted(() => {
  fetchVideos()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2; /* Standard property for compatibility */
  -webkit-box-orient: vertical;
  overflow: hidden;
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

.skeleton-thumbnail {
  width: 100%;
  height: 192px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-title {
  width: 100%;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-channel {
  width: 60%;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-description {
  width: 100%;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-button {
  width: 120px;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

/* Dark mode skeleton styles */
.dark .skeleton-thumbnail,
.dark .skeleton-title,
.dark .skeleton-channel,
.dark .skeleton-description,
.dark .skeleton-button {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200px 100%;
}
</style>
