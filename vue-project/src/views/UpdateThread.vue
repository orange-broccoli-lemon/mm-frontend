<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThreadStore } from '@/stores/thread'
import { useAccountStore } from '@/stores/user'
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
const isLoading = ref(false)

const commentId = Number(route.params.id) // 숫자로 변환
if (isNaN(commentId)) {
  alert('잘못된 댓글 ID입니다.')
  router.back()
}

const movieTitle = ref('영화')
const moviePoster = ref('')

// 별점 표시
const currentRating = computed(() => hoveredRating.value > 0 ? hoveredRating.value : rating.value)
const setRating = (value: number) => rating.value = value
const onStarHover = (value: number) => hoveredRating.value = value
const onStarLeave = () => hoveredRating.value = 0

const getClipPathStyle = (starIndex: number) => {
  const displayRating = hoveredRating.value > 0 ? hoveredRating.value : rating.value
  const starValue = starIndex * 2
  if (displayRating >= starValue) return { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }
  if (displayRating === starValue - 1) return { clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }
  return { clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)' }
}

const goBack = () => router.back()

// 댓글 불러오기
const loadComment = async () => {
  isLoading.value = true
  try {
    const data = await commentStore.detailComment(commentId)
    if (data) {
      content.value = data.content
      isSpoiler.value = data.is_spoiler
      rating.value = Number(data.rating)
      movieTitle.value = data.movie_id ? `영화 #${data.movie_id}` : '영화'
      moviePoster.value = data.user_profile_image || ''
    }
  } catch (err) {
    console.error('댓글 불러오기 실패:', err)
    alert('댓글 정보를 불러오는데 실패했습니다.')
    router.back()
  } finally {
    isLoading.value = false
  }
}

// 리뷰 수정
const handleUpdateComment = async () => {
  if (!content.value.trim()) return alert('내용을 입력해주세요.')
  if (rating.value === 0) return alert('별점을 선택해주세요.')
  if (!userStore.token) {
    alert('로그인이 필요합니다.')
    router.push('/login')
    return
  }

  isLoading.value = true
  try {
    await commentStore.updateComment(commentId, {
      content: content.value,
      rating: rating.value,
      is_spoiler: isSpoiler.value,
      spoiler_confidence: 1,
      is_public: true
    })
    alert('리뷰가 수정되었습니다!')
    router.back()
  } catch (err: any) {
    console.error('리뷰 수정 실패:', err)
    alert('리뷰 수정에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadComment)
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
          <h1 class="text-2xl font-semibold text-gray-900">리뷰 수정</h1>
        </div>
      </div>
    </div>

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
              />
              <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                <div class="text-2xl mb-1">🎬</div>
                <div class="text-xs text-center px-1">포스터 없음</div>
              </div>
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ movieTitle }}</h2>
              <p class="text-gray-600">이 영화에 대한 리뷰를 수정합니다</p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleUpdateComment" class="space-y-6">
          <!-- Rating Section -->
          <div class="flex items-center gap-2 mb-4">
            <div class="flex items-center">
              <template v-for="starIndex in 5" :key="starIndex">
                <div class="relative cursor-pointer select-none w-10 h-10">
                  <span class="absolute inset-0">
                    <img :src="graystar" alt="gray star" class="w-full h-full object-contain" />
                  </span>
                  <span
                    class="absolute top-0 left-0 h-full w-full overflow-hidden"
                    :style="getClipPathStyle(starIndex)"
                  >
                    <img :src="yellowstar" alt="yellow star" class="w-full h-full object-cover" />
                  </span>
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
              {{ isLoading ? '처리 중...' : '리뷰 수정하기' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
