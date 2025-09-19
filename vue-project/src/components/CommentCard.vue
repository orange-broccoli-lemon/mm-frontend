<template>
  <div
    class="comment-card relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer h-80 flex flex-col"
    @click="goToMovieDetail"
  >
    <!-- ⋯ 버튼 -->
    <div class="absolute top-3 right-3 z-20 dropdown-container" v-if="lastPathSegment === 'mypage'">
      <button
        @click.stop="toggleMenu"
        class="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-gray-50 dark:hover:bg-gray-700/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200/50 dark:border-gray-600/50"
      >
        <svg class="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
        </svg>
      </button>
      
      <!-- 드롭다운 메뉴 -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95 translate-y-1"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-1"
      >
        <div
          v-if="showMenu"
          class="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-600/50 z-30 backdrop-blur-sm transform origin-top-right"
        >
          <div class="py-2">
            <button
              @click.stop="goToUpdate"
              class="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200 group"
            >
              <svg class="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              수정
            </button>
            <button
              @click.stop="deleteReview"
              class="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 group"
            >
              <svg class="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              삭제
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Top Image Section -->
    <div class="relative h-40 overflow-hidden border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
      <img
        :src="movie_poster_url || spottiImage"
        alt="영화이미지"
        class="w-full h-full object-cover"
      />
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

      <!-- Movie Title Overlay -->
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
            <template v-for="i in 5" :key="i">
              <span
                :class="i <= Math.ceil(rating/2) ? 'text-yellow-400' : 'text-gray-300'"
                class="text-sm"
              >
                ⭐
              </span>
            </template>
          </div>
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400">👍{{likes_count}}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, Transition, onUnmounted } from 'vue'
import { useRouter , useRoute} from 'vue-router'
import fitty from 'fitty'
import spottiImage from '@/assets/spotti.png'
import { useThreadStore } from '@/stores/thread'
const route = useRoute()
const commentStore = useThreadStore()
const lastPathSegment = route.fullPath.split('/').pop()
const props = defineProps<{
  comment_id: number
  movie_id: number
  profileImage: string
  content: string
  name: string
  movietitle: string
  movie_poster_url: string
  rating: number 
  likes_count: number
}>()

const emit = defineEmits<{
  deleted: [commentId: number]
}>()
const router = useRouter()
const contentRef = ref<HTMLElement>()

// 메뉴 상태
const showMenu = ref(false)
const toggleMenu = () => (showMenu.value = !showMenu.value)

// 외부 클릭 시 메뉴 닫기
const closeMenuOnOutsideClick = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-container')) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenuOnOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenuOnOutsideClick)
})

// 영화 디테일 페이지로 이동
const goToMovieDetail = () => {
  router.push({
    name: 'movie-detail', // 실제 라우터 이름 맞게 수정
    params: { id: props.movie_id }
  })
}

// 수정 버튼 → update-review 라우트로 이동
const goToUpdate = () => {
  router.push({ name: 'update-review', params: { id: props.comment_id } })
  showMenu.value = false
}

// 삭제 버튼 클릭
const deleteReview = async () => {
  showMenu.value = false
  
  // 확인 대화상자
  if (!confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
    return
  }
  
  try {
    await commentStore.deleteComment(props.comment_id)
    console.log('리뷰 삭제 완료')
    
    // 부모 컴포넌트에 삭제 완료 이벤트 전달
    emit('deleted', props.comment_id)
  } catch (error: any) {
    console.error('리뷰 삭제 실패:', error)
    
    // 구체적인 오류 메시지 표시
    let errorMessage = '리뷰 삭제에 실패했습니다.'
    
    if (error.message?.includes('로그인이 만료')) {
      errorMessage = '로그인이 만료되었습니다. 다시 로그인해주세요.'
      // 로그인 페이지로 이동
      router.push('/login')
    } else if (error.message?.includes('로그인이 필요')) {
      errorMessage = '로그인이 필요합니다.'
      router.push('/login')
    } else if (error.response?.status === 401) {
      errorMessage = '인증이 필요합니다. 다시 로그인해주세요.'
      router.push('/login')
    } else if (error.response?.status === 403) {
      errorMessage = '삭제 권한이 없습니다.'
    } else if (error.response?.status === 404) {
      errorMessage = '해당 리뷰를 찾을 수 없습니다.'
    }
    
    alert(errorMessage)
  }
}

// fitty 적용
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

// rating을 local state로 저장
const rating = ref(props.rating || 0)
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
