<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThreadStore } from '@/stores/thread'
import { useAccountStore } from '@/stores/user'
import axios from 'axios'
import yellowstar from '@/assets/star-solid-full.svg'
import graystar from '@/assets/star-solid-full_gray.svg'

const route = useRoute()
const router = useRouter()
const commentStore = useThreadStore()
const userStore = useAccountStore()

const content = ref('')
const isSpoiler = ref(false)
const rating = ref(0)
const hoveredRating = ref(0)
const existingComment = ref<any>(null)
const isLoading = ref(false)

// 영화 정보 (쿼리 파라미터에서 가져오거나 기본값 사용)
const movieId = ref(Number(route.query.movieId) || Number(route.params.id) || 1)
const movieTitle = ref(route.query.movieTitle as string || '영화')
const moviePoster = ref(decodeURIComponent(route.query.poster_url as string || ''))

// 디버깅: 쿼리 파라미터 확인
console.log('CreateThread 쿼리 파라미터:', route.query)
console.log('포스터 URL:', moviePoster.value)
console.log('포스터 URL 타입:', typeof moviePoster.value)
console.log('포스터 URL 길이:', moviePoster.value?.length)
console.log('포스터 URL이 비어있는가:', !moviePoster.value)

// 현재 표시할 별점 (호버 중이면 호버 값, 아니면 선택된 값)
const currentRating = computed(() => {
  return hoveredRating.value > 0 ? hoveredRating.value : rating.value
})

// 사용자의 기존 리뷰 개수 확인 (참고용)
const loadExistingComments = async () => {
  if (!userStore.token || !userStore.userId) {
    return
  }

  try {
    isLoading.value = true
    
    // API에서 해당 영화의 사용자 리뷰 개수 조회
    const response = await axios.get(`https://i13m105.p.ssafy.io/api/v1/comments/movie/${movieId.value}`, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        Accept: "application/json"
      }
    })

    if (response.data && Array.isArray(response.data)) {
      const userComments = response.data.filter((comment: any) => comment.user_id === userStore.userId)
      existingComment.value = userComments.length > 0 ? userComments : null
    }
  } catch (error) {
    console.error('기존 리뷰 조회 실패:', error)
  } finally {
    isLoading.value = false
  }
}

// 별점 설정 함수
const setRating = (value: number) => {
  console.log('별점 설정:', value)
  rating.value = value
  console.log('현재 rating.value:', rating.value)
}

// 별점 호버 함수
const onStarHover = (value: number) => {
  console.log('별점 호버:', value)
  hoveredRating.value = value
  console.log('현재 hoveredRating.value:', hoveredRating.value)
}

// 별점 호버 아웃 함수
const onStarLeave = () => {
  console.log('별점 호버 아웃')
  hoveredRating.value = 0
  console.log('현재 hoveredRating.value:', hoveredRating.value)
}


const totalStars = 10  // 5개의 별을 0.5점 단위로 나누어 10칸

const getClipPathStyle = (starIndex: number) => {
  const displayRating = hoveredRating.value > 0 ? hoveredRating.value : rating.value
  const starValue = starIndex * 2

  if (displayRating >= starValue) {
    // 꽉 찬 별, 전체 노출
    return { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }
  } else if (displayRating === starValue - 1) {
    // 왼쪽 50%만 노출 (반별)
    return { clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }
  } else {
    // 빈 별, 전부 숨김
    return { clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)' }
  }
}

// 컴포넌트 마운트 시 기존 리뷰 개수 확인
onMounted(async () => {
  await loadExistingComments()
})

// 라우트 쿼리 파라미터 변경 감지
watch(() => route.query, (newQuery) => {
  console.log('라우트 쿼리 파라미터 변경됨:', newQuery)
  movieId.value = Number(newQuery.movieId) || Number(route.params.id) || 1
  movieTitle.value = newQuery.movieTitle as string || '영화'
  moviePoster.value = decodeURIComponent(newQuery.poster_url as string || '')
  
  console.log('업데이트된 영화 정보:', {
    movieId: movieId.value,
    movieTitle: movieTitle.value,
    moviePoster: moviePoster.value
  })
}, { immediate: true })

const goBack = () => {
  router.back()
}

// 이미지 로딩 에러 처리
const handleImageError = (event: Event) => {
  console.error('이미지 로딩 실패:', moviePoster.value)
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

// 이미지 로딩 성공 처리
const handleImageLoad = (event: Event) => {
  console.log('이미지 로딩 성공:', moviePoster.value)
}

const handleCreateComment = async () => {
  // 입력 검증
  if (!content.value.trim()) {
    alert('내용을 입력해주세요.')
    return
  }

  if (rating.value === 0) {
    alert('별점을 선택해주세요.')
    return
  }

  // 로그인 상태 확인
  if (!userStore.token) {
    alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.')
    router.push('/login')
    return
  }

  // 로딩 상태 설정
  isLoading.value = true

  try {
    // 항상 새 리뷰 작성
    if(userStore.user)
  {
    await commentStore.createComment({
      movie_id: movieId.value,
      content: content.value,
      rating: rating.value,
      watched_date: new Date().toISOString().slice(0, 10),
       is_spoiler: isSpoiler.value,
      spoiler_confidence: 1,
      is_public: true,
    })

  }
    alert('리뷰 작성 완료!')
    
    // 리뷰 작성/수정 완료 후 영화 상세 페이지로 이동
    router.push({ 
      name: 'BookDetail', 
      params: { id: movieId.value },
      query: { refresh: Date.now() }
    })
  } catch (error: any) {
    console.error('리뷰 처리 실패:', error)
    
    // 구체적인 오류 메시지 표시
    let errorMessage = '리뷰 처리에 실패했습니다.'
    
    if (error.response?.status === 401) {
      errorMessage = '로그인이 만료되었습니다. 다시 로그인해주세요.'
      router.push('/login')
    } else if (error.response?.status === 403) {
      errorMessage = '권한이 없습니다. 로그인 상태를 확인해주세요.'
    } else if (error.response?.data?.detail) {
      errorMessage = `오류: ${error.response.data.detail}`
    } else if (error.message) {
      errorMessage = `오류: ${error.message}`
    }
    
    alert(errorMessage)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header Section -->
    <div class="bg-gray-50 py-8 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center gap-3 mb-4">
          <button @click="goBack" class="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200">
            <svg class="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="text-2xl font-semibold text-gray-900">
            리뷰 작성
          </h1>
        </div>
      </div>
    </div>

    <!-- Movie Info Section -->
    <div class="py-6 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex items-center gap-4">
            <div class="w-20 h-28 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <img
                v-if="moviePoster && moviePoster.trim()"
                :src="moviePoster"
                :alt="movieTitle"
                class="w-full h-full object-cover"
                @error="handleImageError"
                @load="handleImageLoad"
              />
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                <div class="text-2xl mb-1">🎬</div>
                <div class="text-xs text-center px-1">포스터 없음</div>
              </div>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ movieTitle }}</h2>
              <p class="text-gray-600">
                이 영화에 대한 새로운 리뷰를 작성해주세요
                <span v-if="existingComment && existingComment.length > 0" class="text-sm text-gray-500 ml-2">
                  (이미 {{ existingComment.length }}개의 리뷰를 작성하셨습니다)
                </span>
              </p>
              <!-- 디버깅용 포스터 URL 표시 -->
              <!-- <p v-if="moviePoster" class="text-xs text-gray-400 mt-2 break-all">
                포스터 URL: {{ moviePoster }}
              </p> -->
              <!-- <p v-else class="text-xs text-red-400 mt-2">
                포스터 URL이 없습니다
              </p> -->
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          <span class="ml-3 text-gray-600">로딩 중...</span>
        </div>

        <!-- Review Form -->
        <form v-else @submit.prevent="handleCreateComment" class="space-y-6">
          <!-- Rating Section -->
          <div class="flex items-center gap-2 mb-4">
            <div class="flex items-center">
              <template v-for="starIndex in 5" :key="starIndex">
                <div class="relative cursor-pointer select-none w-10 h-10">
                  
                  <!-- 1. 배경 별 (회색) -->
                  <span class="absolute inset-0">
                    <img :src="graystar" alt="gray star" class="w-full h-full object-contain" />
                  </span>
                  
                  <!-- 2. 노란 별 (반별/꽉찬별), 너비 0%, 50%, 100% 조절 -->
                  <span
                    class="absolute top-0 left-0 h-full w-full overflow-hidden"
                    :style="getClipPathStyle(starIndex)"
                  >
                    <img :src="yellowstar" alt="yellow star" class="w-full h-full object-cover" />
                  </span>
                  
                  <!-- 3. 클릭 영역 좌우 반칸 -->
                  <span
                    class="absolute top-0 left-0 w-1/2 h-full"
                    @click="setRating(starIndex * 2 - 1)"
                    @mouseenter="onStarHover(starIndex * 2 - 1)"
                    @mouseleave="onStarLeave"
                  ></span>
                  <span
                    class="absolute top-0 right-0 w-1/2 h-full"
                    @click="setRating(starIndex * 2)"
                    @mouseenter="onStarHover(starIndex * 2)"
                    @mouseleave="onStarLeave"
                  ></span>
                </div>
              </template>
            </div>




            <span class="ml-4 font-medium text-gray-700">
              {{ rating > 0 ? `${(rating / 2).toFixed(1)}/5` : '별점을 선택해주세요' }}
            </span>

          </div>    

          <!-- Content Section -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">리뷰 내용</h3>
            <textarea
              v-model="content"
              placeholder="영화에 대한 솔직한 리뷰를 작성해주세요..."
              class="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 resize-none"
            ></textarea>
          </div>

          <!-- Spoiler Section -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">스포일러 설정</h3>
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="isSpoiler"
                class="w-5 h-5 text-gray-800 border-gray-300 rounded focus:ring-gray-800"
              />
              <span class="text-gray-700">이 리뷰에는 스포일러가 포함되어 있습니다</span>
            </label>
          </div>

          <!-- Submit Button -->
          <div class="flex gap-4">
            <button
              type="button"
              @click="goBack"
              :disabled="isLoading"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ isLoading ? '처리 중...' : '리뷰 작성하기' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>