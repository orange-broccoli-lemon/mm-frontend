<template>
  <div class="youtube-videos bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="py-4 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- 헤더 -->
        <div class="mb-8 section-header">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-1 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              영화 리뷰
            </h2>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm ml-4 leading-relaxed">
            YouTube에서 영화 리뷰 영상을 확인해보세요
          </p>
        </div>

        <!-- 로딩 -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="n in 3" 
            :key="n" 
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden skeleton-card"
            :style="{ animationDelay: `${(n - 1) * 150}ms` }"
          >
            <div class="skeleton-thumbnail"></div>
            <div class="p-4 space-y-3">
              <div class="skeleton-title"></div>
              <div class="skeleton-channel"></div>
            </div>
          </div>
        </div>

        <!-- 에러 -->
        <div v-else-if="error" class="text-center py-16">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
            <svg class="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">영상을 불러올 수 없습니다</h3>
          <p class="text-red-500 dark:text-red-400 mb-6">{{ error }}</p>
          <button @click="fetchData" class="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            다시 시도
          </button>
        </div>

        <!-- 영상 목록 -->
        <div v-else-if="videos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(video, index) in videos"
            :key="video.id.videoId"
            class="video-card bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <a :href="`https://www.youtube.com/watch?v=${video.id.videoId}`" target="_blank" rel="noopener noreferrer" class="block relative">
              <img 
                :src="video.snippet.thumbnails.high.url" 
                :alt="video.snippet.title" 
                class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" 
              />
              <!-- Play Button Overlay -->
              <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                  <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </a>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 leading-relaxed">
                <a :href="`https://www.youtube.com/watch?v=${video.id.videoId}`" target="_blank" rel="noopener noreferrer"
                   class="hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
                  {{ video.snippet.title }}
                </a>
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 font-medium">{{ video.snippet.channelTitle }}</p>
            </div>
          </div>
        </div>

        <!-- 빈 상태 -->
        <div v-else class="text-center py-16">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
            <svg class="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">영상을 찾을 수 없습니다</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">다른 키워드로 검색해보세요</p>
          <button @click="fetchData" class="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            다시 검색
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { fetchYoutubeVideos, type YoutubeVideo } from "@/stores/youtube"

const videos = ref<YoutubeVideo[]>([])
const loading = ref(false)
const error = ref("")

const fetchData = async () => {
  loading.value = true
  error.value = ""
  try {
    videos.value = await fetchYoutubeVideos("영화 리뷰", 6) // ✅ 키워드 변경 가능
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
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

/* Video Card Entrance Animation */
.video-card {
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

/* Skeleton Card Animation */
.skeleton-card {
  opacity: 0;
  transform: translateY(20px);
  animation: skeletonSlideIn 0.5s ease-out forwards;
}

@keyframes skeletonSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  height: 16rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

.dark .skeleton-thumbnail {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200px 100%;
}

.skeleton-title {
  width: 100%;
  height: 1.25rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.25rem;
}

.skeleton-channel {
  width: 60%;
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.25rem;
}

.dark .skeleton-title,
.dark .skeleton-channel {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200px 100%;
}

/* Enhanced line clamp */
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

/* Staggered animation delays */
.video-card:nth-child(1) {
  animation-delay: 0ms;
}

.video-card:nth-child(2) {
  animation-delay: 100ms;
}

.video-card:nth-child(3) {
  animation-delay: 200ms;
}

.video-card:nth-child(4) {
  animation-delay: 300ms;
}

.video-card:nth-child(5) {
  animation-delay: 400ms;
}

.video-card:nth-child(6) {
  animation-delay: 500ms;
}
</style>
