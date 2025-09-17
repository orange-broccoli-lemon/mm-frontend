<template>
  <div
    class="comment-card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer h-80 flex flex-col"
    @click="goToMovieDetail"
  >
    <!-- Top Image Section -->
    <div class="relative h-40 overflow-hidden border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
      <img
        :src="movie_poster_url || spottiImage"
        alt="영화이미지"
        class="w-full h-full object-cover"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      
      <!-- Movie Title Overlay (하단 중앙) -->
      <div class="absolute bottom-0 left-0 right-0 p-3">
        <h3 class="text-white font-bold text-sm text-center drop-shadow-lg line-clamp-2">
          {{ movietitle }}
        </h3>
      </div>
    </div>

    <!-- Bottom Info Panel -->
    <div class="p-4 flex flex-col flex-1 min-h-0">
      <!-- User Name -->
      <div class="mb-2 flex-shrink-0">
        <p class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{{ name }}</p>
      </div>
      
      <!-- Comment Content -->
      <div class="comment-content-wrapper flex-1 mb-3 min-h-0">
        <p
          ref="contentRef"
          class="comment-content text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words line-clamp-3 h-full"
        >
          {{ content }}
        </p>
      </div>
      
      <!-- Rating Section -->
      <div class="flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-1">
          <div class="flex">
            <span class="text-yellow-400 text-sm">⭐</span>
            <span class="text-yellow-400 text-sm">⭐</span>
            <span class="text-yellow-400 text-sm">⭐</span>
            <span class="text-yellow-400 text-sm">⭐</span>
            <span class="text-yellow-400 text-sm">⭐</span>
          </div>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">리뷰</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import fitty from 'fitty'
import spottiImage from '@/assets/spotti.png'

const props = defineProps<{
  profileImage: string
  content: string
  name: string
  movietitle: string
  movie_poster_url: string
  movie_id: number
}>()

const contentRef = ref<HTMLElement>()
const router = useRouter()

// 영화 디테일 페이지로 이동
const goToMovieDetail = () => {
  console.log('영화 디테일 페이지로 이동:', props.movie_id)
  router.push({
    name: 'BookDetail',
    params: { id: props.movie_id }
  })
}

// 디버깅을 위한 로그
onMounted(() => {
  console.log('=== CommentCard 디버깅 ===')
  console.log('전체 props:', props)
  console.log('movie_poster_url:', props.movie_poster_url)
  console.log('movie_poster_url 타입:', typeof props.movie_poster_url)
  console.log('movie_poster_url 길이:', props.movie_poster_url?.length)
  console.log('movie_poster_url이 null인가:', props.movie_poster_url === null)
  console.log('movie_poster_url이 undefined인가:', props.movie_poster_url === undefined)
  console.log('movie_poster_url이 빈 문자열인가:', props.movie_poster_url === '')
  console.log('spottiImage:', spottiImage)
  console.log('최종 사용될 이미지 URL:', props.movie_poster_url || spottiImage)
  console.log('========================')
})

const applyFitty = () => {
  if (contentRef.value) {
    fitty(contentRef.value, {
      minSize: 12,
      maxSize: 18,
      multiLine: true
    })
  }
}

onMounted(applyFitty)
watch(() => props.content, applyFitty)
</script>

<style scoped>
.comment-card {
  height: 20rem; /* 320px - 고정 높이 */
  max-width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.comment-content-wrapper {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 0; /* flexbox에서 overflow를 위해 필요 */
}

.comment-content {
  width: 100%;
  line-height: 1.5;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
  flex: 1;
  min-height: 0; /* flexbox에서 overflow를 위해 필요 */
}

/* Line clamp utility for text truncation */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

