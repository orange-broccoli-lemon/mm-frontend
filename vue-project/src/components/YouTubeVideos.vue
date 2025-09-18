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

        <!-- 로딩 -->
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

        <!-- 에러 -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-500 dark:text-red-400 mb-4">{{ error }}</p>
          <button @click="fetchData" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            다시 시도
          </button>
        </div>

        <!-- 영상 목록 -->
        <div v-else-if="videos.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="video in videos"
            :key="video.id.videoId"
            class="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <a :href="`https://www.youtube.com/watch?v=${video.id.videoId}`" target="_blank" rel="noopener noreferrer" class="block">
              <img :src="video.snippet.thumbnails.high.url" :alt="video.snippet.title" class="w-full h-48 object-cover" />
            </a>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                <a :href="`https://www.youtube.com/watch?v=${video.id.videoId}`" target="_blank" rel="noopener noreferrer"
                   class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {{ video.snippet.title }}
                </a>
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">{{ video.snippet.channelTitle }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ video.snippet.description }}</p>
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
