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
      <button @click="goBack" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
        돌아가기
      </button>
    </div>

    <!-- 사용자 정보 -->
    <div v-else-if="userProfile" class="max-w-4xl mx-auto px-4 py-8">
      <!-- 헤더 섹션 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="flex items-center gap-6">
          <!-- 프로필 이미지 -->
          <div class="relative">
            <img
              :src="userProfile.profile_image_url || defaultProfileImage"
              :alt="userProfile.name"
              class="w-24 h-24 object-cover rounded-full border-4 border-gray-200 dark:border-gray-600"
            />
            <div v-if="userProfile.is_active" class="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>

          <!-- 사용자 정보 -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ userProfile.name }}</h1>
              <span v-if="!userProfile.is_active" class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                비활성
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ userProfile.email }}</p>
            
            <!-- 통계 정보 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ userProfile.followers_count || 0 }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">팔로워</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ userProfile.following_count || 0 }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">팔로잉</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ userProfile.comments_count || 0 }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">리뷰</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">{{ userProfile.watchlist_count || 0 }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">왓치리스트</div>
              </div>
            </div>
          </div>

          <!-- 액션 버튼 -->
          <div class="flex flex-col gap-2">
            <button 
              v-if="!isOwnProfile"
              @click="toggleFollow"
              :disabled="isFollowLoading"
              :class="[
                'px-6 py-2 rounded-lg font-medium transition-colors duration-200',
                isFollowing ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'
              ]"
            >
              {{ isFollowLoading ? '처리 중...' : (isFollowing ? '팔로우 취소' : '팔로우') }}
            </button>
            <button 
              @click="goBack"
              class="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>

      <!-- 탭 섹션 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <!-- 탭 헤더 -->
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex space-x-8 px-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- 탭 내용 -->
        <div class="p-6">
          <!-- 최근 리뷰 탭 -->
          <div v-if="activeTab === 'reviews'" class="space-y-4">
            <div v-if="userComments.length === 0" class="text-center py-8">
              <div class="text-gray-400 dark:text-gray-500 mb-3">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">아직 작성한 리뷰가 없습니다</p>
            </div>
            <div v-else class="space-y-4">
              <div
                v-for="comment in userComments"
                :key="comment.comment_id"
                class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div class="flex items-start gap-4">
                  <img
                    :src="comment.movie_poster_url || '/src/assets/spotti.png'"
                    :alt="comment.movie_title"
                    class="w-16 h-24 object-cover rounded"
                  />
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ comment.movie_title }}</h3>
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-orange-500">⭐ {{ comment.rating }}/9</span>
                      <span class="text-gray-500 dark:text-gray-400 text-sm">{{ formatDate(comment.create_at) }}</span>
                    </div>
                    <p class="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 팔로워 탭 -->
          <div v-else-if="activeTab === 'followers'" class="space-y-4">
            <div v-if="followers.length === 0" class="text-center py-8">
              <div class="text-gray-400 dark:text-gray-500 mb-3">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">팔로워가 없습니다</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="follower in followers"
                :key="follower.user_id"
                class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <img
                  :src="follower.profile_image_url || defaultProfileImage"
                  :alt="follower.name"
                  class="w-10 h-10 object-cover rounded-full"
                />
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ follower.name }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ follower.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 팔로잉 탭 -->
          <div v-else-if="activeTab === 'following'" class="space-y-4">
            <div v-if="following.length === 0" class="text-center py-8">
              <div class="text-gray-400 dark:text-gray-500 mb-3">
                <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">팔로잉하는 사용자가 없습니다</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="user in following"
                :key="user.user_id"
                class="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <img
                  :src="user.profile_image_url || defaultProfileImage"
                  :alt="user.name"
                  class="w-10 h-10 object-cover rounded-full"
                />
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ user.name }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/user'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const accountStore = useAccountStore()

// 기본 프로필 이미지
const defaultProfileImage = '/src/assets/spotti.png'

// 반응형 데이터
const isLoading = ref(true)
const error = ref('')
const userProfile = ref<any>(null)
const userComments = ref<any[]>([])
const followers = ref<any[]>([])
const following = ref<any[]>([])
const isFollowLoading = ref(false)
const activeTab = ref('reviews')
const isFollowing = ref(false)

// 사용자 ID
const userId = Number(route.params.userId)

// 탭 목록
const tabs = [
  { id: 'reviews', name: '최근 리뷰' },
  { id: 'followers', name: '팔로워' },
  { id: 'following', name: '팔로잉' }
]

// 현재 사용자의 프로필인지 확인
const isOwnProfile = computed(() => {
  return accountStore.user?.user_id === userId
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
    const response = await axios.get(`https://i13m105.p.ssafy.io/api/v1/users/${userId}/follow/check`, {
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
    
    const response = await axios.get(`https://i13m105.p.ssafy.io/api/v1/users/${userId}`, {
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
    // TODO: 사용자 댓글 API 호출
    userComments.value = []
  } catch (err) {
    console.error('사용자 댓글 로드 실패:', err)
  }
}

// 팔로워 목록 로드
const loadFollowers = async () => {
  try {
    // TODO: 팔로워 목록 API 호출
    followers.value = []
  } catch (err) {
    console.error('팔로워 목록 로드 실패:', err)
  }
}

// 팔로잉 목록 로드
const loadFollowing = async () => {
  try {
    // TODO: 팔로잉 목록 API 호출
    following.value = []
  } catch (err) {
    console.error('팔로잉 목록 로드 실패:', err)
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
      await accountStore.unFollowUser(userId)
      isFollowing.value = false
      // 팔로워 수 감소
      if (userProfile.value) {
        userProfile.value.followers_count = Math.max((userProfile.value.followers_count || 0) - 1, 0)
      }
    } else {
      await accountStore.followUser(userId)
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

// 뒤로가기
const goBack = () => {
  router.back()
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  console.log('UserProfileView 마운트 - 현재 사용자:', accountStore.user)
  console.log('UserProfileView 마운트 - 토큰 존재:', !!accountStore.token)
  console.log('UserProfileView 마운트 - 토큰 길이:', accountStore.token?.length)
  
  await loadUserProfile()
  await checkFollowStatus() // 팔로우 상태 확인
  await loadUserComments()
  await loadFollowers()
  await loadFollowing()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
