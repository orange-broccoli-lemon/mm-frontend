<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300" v-if="accountStore.user">
    <!-- 헤더 섹션 -->
    <div class="bg-gray-50 dark:bg-gray-800 py-8 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center gap-4">
            <div class="relative">
              <img
                :src="accountStore.user.profile_image_url || defaultProfileImage"
                alt="프로필 이미지"
                class="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              />
              <div class="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white" 
                   :class="{ 'bg-green-500': accountStore.user && accountStore.token, 'bg-gray-400': !accountStore.user || !accountStore.token }"></div>
            </div>
            <div>
              <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ accountStore.user.name }}</h1>
              <p class="text-gray-600 dark:text-gray-400">영화 리뷰어</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 통계 카드 섹션 -->
    <div class="py-6 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ accountStore.user.comments_count || 0 }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">리뷰</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" @click="goFollowing">
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ accountStore.user.followers_count || 0 }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">팔로워</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" @click="goFollowing">
            <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ accountStore.user.following_count || 0 }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">팔로잉</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 액션 버튼 섹션 -->
    <div class="py-6 px-4">
      <div class="max-w-4xl mx-auto">
        <button class="w-full bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center" @click="goToHotMovies">
          <img src="@/assets/spotti.png" alt="스포띠" class="w-6 h-6 mr-2">
          스포띠빠이와 함께 리뷰쓰러가기
        </button>
      </div>
    </div>

    <!-- 최근 리뷰 섹션 -->
    <div class="py-6 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">최근 리뷰</h2>
          <span class="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ accountStore.user.comments_count || 0 }}개</span>
        </div>
        
        <div class="space-y-4" v-if="accountStore.user && accountStore.user.recent_comments && Array.isArray(accountStore.user.recent_comments) && accountStore.user.recent_comments.length > 0">
          <div 
            v-for="comment in accountStore.user.recent_comments" 
            :key="comment.comment_id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div class="flex items-start gap-3 mb-3">
              <img
                :src="comment.user_profile_image || defaultProfileImage"
                alt="프로필"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <div class="flex items-center gap-1">
                    <span v-for="star in 9" :key="star" class="text-xs" :class="{ 'text-yellow-400': star <= comment.rating, 'text-gray-300': star > comment.rating }">⭐</span>
                  </div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ comment.rating }}/9</span>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-500">{{ formatDate(comment.create_at) }}</div>
              </div>
            </div>
            <div class="text-gray-800 dark:text-gray-200">
              <p class="truncate" :title="comment.content">{{ comment.content }}</p>
            </div>
          </div>
        </div>
        
        <!-- 디버깅 정보 표시 -->
        <div v-else-if="accountStore.user" class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <h4 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">디버깅 정보:</h4>
          <p class="text-xs text-yellow-700 dark:text-yellow-300">리뷰 개수: {{ accountStore.user.comments_count }}</p>
          <p class="text-xs text-yellow-700 dark:text-yellow-300">recent_comments 존재: {{ !!accountStore.user.recent_comments }}</p>
          <p class="text-xs text-yellow-700 dark:text-yellow-300">recent_comments 타입: {{ typeof accountStore.user.recent_comments }}</p>
          <p class="text-xs text-yellow-700 dark:text-yellow-300">recent_comments 길이: {{ accountStore.user.recent_comments?.length || 'undefined' }}</p>
          <p class="text-xs text-yellow-700 dark:text-yellow-300">recent_comments 내용: {{ JSON.stringify(accountStore.user.recent_comments) }}</p>
        </div>
        
        <div v-else class="text-center py-12">
          <div class="text-4xl mb-4">📝</div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">아직 작성한 리뷰가 없어요</h3>
          <p class="text-gray-600 dark:text-gray-400">첫 번째 영화 리뷰를 작성해보세요!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAccountStore } from '../stores/user'
import { useRouter } from 'vue-router'
import CommentCard from '@/components/CommentCard.vue'
import spottiImage from '@/assets/spotti.png'

const accountStore = useAccountStore()
const router = useRouter()
const defaultProfileImage = spottiImage

const goFollowing = () => {
  router.push('/following')
}

const goToHotMovies = () => {
  router.push('/select-movie')
}

const formatDate = (dateString: string) => {
  if (!dateString) return '날짜 없음'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return '날짜 없음'
    }
    
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      return '오늘'
    } else if (diffDays === 2) {
      return '어제'
    } else if (diffDays <= 7) {
      return `${diffDays - 1}일 전`
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error)
    return '날짜 없음'
  }
}

onMounted(async () => {
  console.log('MyPage 마운트됨, 사용자 정보 로드 중...')
  const result = await accountStore.getUserInfo()
  if (result.success) {
    console.log('사용자 정보 로드 성공:', accountStore.user)
    console.log('최근 리뷰:', accountStore.user?.recent_comments)
    console.log('리뷰 개수:', accountStore.user?.comments_count)
    console.log('recent_comments 타입:', typeof accountStore.user?.recent_comments)
    console.log('recent_comments 길이:', accountStore.user?.recent_comments?.length)
    
    // recent_comments가 배열이 아닌 경우 배열로 변환
    if (accountStore.user?.recent_comments && !Array.isArray(accountStore.user.recent_comments)) {
      console.log('recent_comments를 배열로 변환 중...')
      accountStore.user.recent_comments = [accountStore.user.recent_comments]
    }
  } else {
    console.error('사용자 정보 로드 실패:', result.error)
  }
})
</script>