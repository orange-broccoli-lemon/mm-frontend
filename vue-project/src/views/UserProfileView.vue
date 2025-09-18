<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span class="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">사용자 정보를 불러오는 중...</span>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20">
      <div class="text-gray-400 dark:text-gray-500 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">사용자를 찾을 수 없습니다</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ error }}</p>
     
    </div>

    <!-- 사용자 정보 -->
    <div v-else-if="userProfile">
      <!-- 헤더 섹션 -->
      <div class="bg-gray-50 dark:bg-gray-800 py-8 px-4 animate-fade-in">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center gap-4">
              <div class="relative animate-scale-in">
                <img
                  :src="getProfileImageUrl(userProfile.profile_image_url)"
                  :alt="userProfile.name"
                  class="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
                <div
                  class="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white"
                  :class="{
                    'bg-green-500': userProfile.is_active,
                    'bg-gray-400': !userProfile.is_active
                  }"
                ></div>
              </div>
              <div class="animate-slide-in-right">
                <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {{ userProfile.name }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400">영화 리뷰어</p>
              </div>

            </div>
            <div
          class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 
                text-gray-700 dark:text-gray-300 animate-slide-up"
        >
          <span class="font-bold">| 유저 성향</span>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            {{ userProfile.profile_review || '아직 설정되지 않았습니다.' }}
          </p>
          </div>
          </div>
        </div>
      </div>

      <!-- 통계 카드 섹션 -->
      <div class="py-6 px-4 animate-slide-up">
        <div class="max-w-4xl mx-auto">
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center animate-fade-in-delayed">
              <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ userProfile.comments_count || 0 }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">리뷰</div>
            </div>
            <div 
              class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 animate-fade-in-delayed-2"
              @click="showFollowingModal = true"
            >
              <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ userProfile.followers_count || 0 }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">팔로워</div>
            </div>
            <div 
              class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 animate-fade-in-delayed-3"
              @click="showFollowingModal = true"
            >
              <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {{ userProfile.following_count || 0 }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">팔로잉</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 액션 버튼 섹션 -->
      <div class="py-6 px-4 animate-slide-up-delayed">
        <div class="max-w-4xl mx-auto">
          <div class="flex gap-4">
            <button 
              v-if="!isOwnProfile"
              @click="toggleFollow"
              :disabled="isFollowLoading"
              :class="[
                'flex-1 py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center',
                isFollowing ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'
              ]"
            >
              {{ isFollowLoading ? '처리 중...' : (isFollowing ? '팔로우 취소' : '팔로우') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 최근 리뷰 섹션 -->
      <div class="py-6 px-4 animate-slide-up-delayed-2">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              리뷰 {{ userComments.length }}개
            </h2>
            <button class="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded" @click="showAllComments = !showAllComments">
              {{ showAllComments ? '접기' : '더보기' }}
            </button>
          </div>

          <div v-if="userComments.length > 0">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <CommentCard
                v-for="comment in (showAllComments ? userComments : userComments.slice(0, 4))"
                :key="comment.comment_id"
                :comment_id="comment.comment_id"
                :profileImage="getProfileImageUrl(userProfile.profile_image_url)"
                :content="comment.content"
                :name="userProfile?.name || '이름 없음'"
                :movietitle="comment.movie_title"
                :movie_poster_url="comment.movie_poster_url"
                :movie_id="comment.movie_id"
                :rating="Number(comment.rating) || 0"
                :likes_count="comment.likes_count || 0"
              />
            </div>
          </div>
          <div v-else class="text-center py-12 text-gray-600 dark:text-gray-400">
            <div class="text-4xl mb-4">📝</div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">아직 작성한 리뷰가 없어요</h3>
            <p>첫 번째 영화 리뷰를 작성해보세요!</p>
          </div>
        </div>
      </div>

      <!-- 좋아요한 영화 섹션 -->
      <div class="py-6 px-4 animate-slide-up-delayed-3">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
              좋아요한 영화 {{ userLikes.length }}개
            </h2>
            <button class="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded" @click="showAllLikes = !showAllLikes">
              {{ showAllLikes ? '접기' : '더보기' }}
            </button>
          </div>

          <div v-if="userLikes.length > 0">
            <div class="grid grid-cols-4 gap-4">
              <MovieCard
                v-for="movie in showAllLikes ? userLikes : userLikes.slice(0, 4)"
                :key="movie.movie_id"
                :image="movie.poster_url || '/no-image.png'"
                :title="movie.title"
              />
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-600 dark:text-gray-400">
            좋아요한 영화가 없어요
          </div>
        </div>
      </div>

    </div>

    <!-- 팔로워/팔로잉 모달 -->
    <FollowingModal
      :is-open="showFollowingModal"
      :target-user-id="userId"
      @close="showFollowingModal = false"
    />
  </div>
</template>

<style scoped>
/* 애니메이션 효과 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInDelayed {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 애니메이션 클래스 */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out 0.2s both;
}

.animate-scale-in {
  animation: scaleIn 0.6s ease-out 0.4s both;
}

.animate-slide-in-right {
  animation: slideInRight 0.8s ease-out 0.6s both;
}

.animate-fade-in-delayed {
  animation: fadeInDelayed 0.6s ease-out 0.8s both;
}

.animate-fade-in-delayed-2 {
  animation: fadeInDelayed 0.6s ease-out 1.0s both;
}

.animate-fade-in-delayed-3 {
  animation: fadeInDelayed 0.6s ease-out 1.2s both;
}

.animate-slide-up-delayed {
  animation: slideUp 0.8s ease-out 1.0s both;
}

.animate-slide-up-delayed-2 {
  animation: slideUp 0.8s ease-out 1.2s both;
}

.animate-slide-up-delayed-3 {
  animation: slideUp 0.8s ease-out 1.4s both;
}
</style>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/user'
import FollowingModal from '@/components/FollowingModal.vue'
import MovieCard from '@/components/MovieCard.vue'
import CommentCard from '@/components/CommentCard.vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const accountStore = useAccountStore()

// 기본 프로필 이미지
const defaultProfileImage = '/src/assets/spotti.png'

// 프로필 이미지 URL을 절대 경로로 변환
const getProfileImageUrl = (url?: string) => {
  if (!url) return defaultProfileImage
  
  // 이미 절대 URL인 경우 (http:// 또는 https://로 시작)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // 상대 경로인 경우 서버 주소 추가
  const baseUrl = 'https://i13m105.p.ssafy.io'
  return `${baseUrl}${url}`
}

// 반응형 데이터
const isLoading = ref(true)
const error = ref('')
const userProfile = ref<any>(null)
const userComments = ref<any[]>([])
const userLikes = ref<any[]>([])
const isFollowLoading = ref(false)
const isFollowing = ref(false)
const showFollowingModal = ref(false)
const showAllLikes = ref(false)
const showAllComments = ref(false)

// 사용자 ID (반응형으로 변경)
const userId = ref(Number(route.params.userId))

// 현재 사용자의 프로필인지 확인
const isOwnProfile = computed(() => {
  return accountStore.user?.user_id === userId.value
})

// 팔로우 상태 확인 함수
const checkFollowStatus = async () => {
  if (!accountStore.token || isOwnProfile.value) {
    console.log('팔로우 상태 확인 건너뜀 - 토큰:', !!accountStore.token, '자신의 프로필:', isOwnProfile.value)
    return
  }
  
  console.log('팔로우 상태 확인 시작 - 토큰 존재:', !!accountStore.token, '토큰 길이:', accountStore.token?.length)
  
  try {
    // 팔로우 상태 확인 API 호출 (팔로우 관계 확인 엔드포인트 사용)
    const response = await axios.get(`https://i13m105.p.ssafy.io/api/v1/users/${userId.value}/follow/check`, {
      headers: {
        'Authorization': `Bearer ${accountStore.token}`,
        'Accept': 'application/json'
      }
    })
    
    // API 응답에서 팔로우 상태 확인
    isFollowing.value = response.data.is_following || false
    
  } catch (err: any) {
    console.error('팔로우 상태 확인 실패:', err)
    
    // 401 오류 시 자동 로그아웃
    if (err.response?.status === 401) {
      console.log('토큰이 만료되었습니다. 자동 로그아웃합니다.')
      accountStore.logOut()
      router.push('/login')
    }
    
    isFollowing.value = false
  }
}

// 사용자 정보 로드
const loadUserProfile = async () => {
  try {
    isLoading.value = true
    error.value = ''
    
    const response = await axios.get(`https://i13m105.p.ssafy.io/api/v1/users/${userId.value}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    userProfile.value = response.data
    console.log('사용자 프로필 로드:', response.data)
    
  } catch (err: any) {
    console.error('사용자 프로필 로드 실패:', err)
    if (err.response?.status === 404) {
      error.value = '사용자를 찾을 수 없습니다.'
    } else {
      error.value = '사용자 정보를 불러오는 중 오류가 발생했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}

// 사용자 댓글 로드
const loadUserComments = async () => {
  try {
    // 직접 API 호출 (토큰 없이도 접근 가능하도록)
    const response = await axios.get(`https://i13m105.p.ssafy.io/api/v1/users/${userId.value}/comments`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    userComments.value = response.data || []
    console.log('사용자 댓글 로드 성공:', response.data)
  } catch (err) {
    console.error('사용자 댓글 로드 실패:', err)
    userComments.value = []
  }
}

// 사용자 좋아요 목록 로드
const loadUserLikes = async () => {
  try {
    // 직접 API 호출 (토큰 없이도 접근 가능하도록)
    const response = await axios.get(`https://i13m105.p.ssafy.io/api/v1/users/${userId.value}/liked-movies`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    userLikes.value = response.data || []
    console.log('사용자 좋아요 목록 로드 성공:', response.data)
  } catch (err) {
    console.error('사용자 좋아요 목록 로드 실패:', err)
    userLikes.value = []
  }
}


// 팔로우 토글
const toggleFollow = async () => {
  if (!accountStore.token) {
    alert('로그인이 필요합니다.')
    return
  }
  
  try {
    isFollowLoading.value = true
    
    if (isFollowing.value) {
      await accountStore.unFollowUser(userId.value)
      isFollowing.value = false
      // 팔로워 수 감소
      if (userProfile.value) {
        userProfile.value.followers_count = Math.max((userProfile.value.followers_count || 0) - 1, 0)
      }
    } else {
      await accountStore.followUser(userId.value)
      isFollowing.value = true
      // 팔로워 수 증가
      if (userProfile.value) {
        userProfile.value.followers_count = (userProfile.value.followers_count || 0) + 1
      }
    }
    
    // 팔로우/언팔로우 후 현재 사용자 정보 새로고침 (마이페이지 팔로잉 수 업데이트)
    if (accountStore.user?.user_id) {
      await accountStore.getUserInfo()
    }
    
    console.log('팔로우 상태 변경 완료:', isFollowing.value)
    
  } catch (err) {
    console.error('팔로우 토글 실패:', err)
    alert('팔로우 처리 중 오류가 발생했습니다.')
  } finally {
    isFollowLoading.value = false
  }
}

// 날짜 포맷팅
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}


// 데이터 로드 함수
const loadAllData = async () => {
  console.log('UserProfileView 데이터 로드 - userId:', userId.value)
  await loadUserProfile()
  await checkFollowStatus() // 팔로우 상태 확인
  await loadUserComments()
  await loadUserLikes()
}

// 라우트 파라미터 변경 감지
watch(() => route.params.userId, async (newUserId) => {
  if (newUserId) {
    userId.value = Number(newUserId)
    console.log('라우트 변경 감지 - 새로운 userId:', userId.value)
    await loadAllData()
  }
}, { immediate: false })

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  console.log('UserProfileView 마운트 - 현재 사용자:', accountStore.user)
  console.log('UserProfileView 마운트 - 토큰 존재:', !!accountStore.token)
  console.log('UserProfileView 마운트 - 토큰 길이:', accountStore.token?.length)
  
  await loadAllData()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
