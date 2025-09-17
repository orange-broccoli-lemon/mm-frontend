<template>
  <!-- 모달 오버레이 -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 flex items-center justify-center z-50"
    @click="closeModal"
  >
    <!-- 모달 컨텐츠 -->
    <div 
      ref="modalRef"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 w-[800px] h-[700px] mx-4 overflow-hidden cursor-move"
      @click.stop
      @mousedown="startDrag"
      :style="{ transform: `translate(${position.x}px, ${position.y}px)` }"
    >
      <!-- 모달 헤더 -->
      <div class="modal-header flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-move">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          팔로워 & 팔로잉
        </h3>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 탭 네비게이션 -->
      <div class="px-4 pt-4">
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'followers'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === 'followers'
                  ? 'border-gray-800 dark:border-gray-200 text-gray-800 dark:text-gray-200'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              ]"
            >
              팔로워 ({{ followers.length }})
            </button>
            <button
              @click="activeTab = 'following'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
                activeTab === 'following'
                  ? 'border-gray-800 dark:border-gray-200 text-gray-800 dark:text-gray-200'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              ]"
            >
              팔로잉 ({{ following.length }})
            </button>
          </nav>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-gray-200"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">로딩 중...</span>
      </div>

      <!-- 팔로워 목록 -->
      <div v-else-if="activeTab === 'followers'" class="h-[580px] overflow-y-auto">
        <div v-if="followers.length > 0" class="p-4 space-y-3">
          <div
            v-for="follower in followers"
            :key="follower.user_id"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <!-- 프로필 이미지 (클릭 가능) -->
            <img
              :src="follower.profile_image_url || defaultProfileImage"
              :alt="follower.name || follower.username || '사용자'"
              @click="goToUserProfile(follower.user_id)"
              class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity duration-200"
            />
            
            <!-- 사용자 정보 -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {{ follower.name || follower.username || '사용자' }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ follower.email || '이메일 없음' }}
              </p>
            </div>

            <!-- 팔로우 버튼 (토글식) -->
            <button
              v-if="follower.user_id !== currentUserId"
              @click="toggleFollow(follower.user_id)"
              :class="[
                'px-3 py-1 text-xs rounded-full font-medium transition-colors duration-200',
                follower.is_following 
                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
                  : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
              ]"
            >
              {{ follower.is_following ? '팔로잉 취소' : '팔로우' }}
            </button>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-8">
          <div class="text-4xl mb-4">👥</div>
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">팔로워가 없습니다</h4>
          <p class="text-gray-600 dark:text-gray-400 text-sm">아직 나를 팔로우하는 사용자가 없습니다.</p>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
            (API 데이터: {{ followers.length }}개, 사용자 정보: {{ accountStore.user?.followers_count || 0 }}개)
          </p>
        </div>
      </div>

      <!-- 팔로잉 목록 -->
      <div v-else-if="activeTab === 'following'" class="h-[580px] overflow-y-auto">
        <div v-if="following.length > 0" class="p-4 space-y-3">
          <div
            v-for="user in following"
            :key="user.user_id"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <!-- 프로필 이미지 (클릭 가능) -->
            <img
              :src="user.profile_image_url || defaultProfileImage"
              :alt="user.name || user.username || '사용자'"
              @click="goToUserProfile(user.user_id)"
              class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity duration-200"
            />
            
            <!-- 사용자 정보 -->
            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {{ user.name || user.username || '사용자' }}
              </h4>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ user.email || '이메일 없음' }}
              </p>
            </div>

            <!-- 언팔로우 버튼 -->
            <button
              v-if="user.user_id !== currentUserId"
              @click="toggleFollow(user.user_id)"
              class="px-3 py-1 text-xs rounded-full font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 transition-colors duration-200"
            >
              팔로잉 취소
            </button>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-8">
          <div class="text-4xl mb-4">👤</div>
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">팔로잉이 없습니다</h4>
          <p class="text-gray-600 dark:text-gray-400 text-sm">아직 팔로우하는 사용자가 없습니다.</p>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
            (API 데이터: {{ following.length }}개, 사용자 정보: {{ accountStore.user?.following_count || 0 }}개)
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/user'
import defaultProfileImage from '@/assets/spotti.png'

interface User {
  user_id: number
  name?: string
  username?: string
  email?: string
  profile_image_url?: string
  is_following?: boolean
}

const props = defineProps<{
  isOpen: boolean
  targetUserId?: number // 특정 유저의 팔로워/팔로잉을 보여줄 때 사용
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const accountStore = useAccountStore()
const activeTab = ref<'followers' | 'following'>('followers')
const followers = ref<User[]>([])
const following = ref<User[]>([])
const loading = ref(false)
const currentUserId = ref(accountStore.userId)

// 드래그 관련 상태
const modalRef = ref<HTMLElement>()
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// 드래그 시작
const startDrag = (e: MouseEvent) => {
  // 헤더 영역에서만 드래그 가능
  const target = e.target as HTMLElement
  if (!target.closest('.modal-header')) return
  
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  e.preventDefault()
}

// 드래그 중
const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  
  position.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y
  }
}

// 드래그 종료
const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 컴포넌트 언마운트 시 이벤트 리스너 정리
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
})

// 모달이 열릴 때 데이터 로드 및 위치 초기화
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    // 위치 초기화
    position.value = { x: 0, y: 0 }
    // 먼저 사용자 정보를 새로고침하여 최신 팔로워/팔로잉 수를 가져옴
    await accountStore.getUserInfo()
    await loadData()
  }
})

const loadData = async () => {
  // targetUserId가 있으면 해당 유저의 데이터를, 없으면 현재 사용자의 데이터를 로드
  const userId = props.targetUserId || accountStore.user?.user_id
  if (!userId) {
    return
  }
  
  loading.value = true
  try {
    // 팔로워와 팔로잉 데이터를 병렬로 로드
    await Promise.all([
      loadFollowers(userId),
      loadFollowing(userId)
    ])
  } finally {
    loading.value = false
  }
}

const loadFollowers = async (userId: number) => {
  try {
    const data = await accountStore.getFollowers(userId)
    
    // 데이터가 배열인지 확인하고 처리
    if (Array.isArray(data)) {
      followers.value = data
    } else if (data && typeof data === 'object') {
      // 객체인 경우 배열로 변환 시도
      if (data.users && Array.isArray(data.users)) {
        followers.value = data.users
      } else if (data.followers && Array.isArray(data.followers)) {
        followers.value = data.followers
      } else if (data.results && Array.isArray(data.results)) {
        followers.value = data.results
      } else {
        followers.value = []
      }
    } else {
      followers.value = []
    }
  } catch (error) {
    console.error('팔로워 로드 실패:', error)
    followers.value = []
  }
}

const loadFollowing = async (userId: number) => {
  try {
    // 팔로잉 목록을 API에서 직접 가져오기
    const data = await accountStore.getFollowing(userId)
    
    // 데이터가 배열인지 확인하고 처리
    if (Array.isArray(data)) {
      following.value = data
    } else if (data && typeof data === 'object') {
      // 객체인 경우 배열로 변환 시도
      if (data.users && Array.isArray(data.users)) {
        following.value = data.users
      } else if (data.following && Array.isArray(data.following)) {
        following.value = data.following
      } else if (data.results && Array.isArray(data.results)) {
        following.value = data.results
      } else {
        following.value = []
      }
    } else {
      following.value = []
    }
  } catch (error) {
    console.error('팔로잉 로드 실패:', error)
    following.value = []
  }
}

const closeModal = () => {
  emit('close')
}

// 사용자 프로필 페이지로 이동
const goToUserProfile = (userId: number) => {
  // 모달을 닫고 사용자 프로필 페이지로 이동
  closeModal()
  router.push({ name: 'UserProfile', params: { userId: userId.toString() } })
}

const toggleFollow = async (targetUserId: number) => {
  try {
    if (activeTab.value === 'followers') {
      const follower = followers.value.find(f => f.user_id === targetUserId)
      if (!follower) return

      if (follower.is_following) {
        await accountStore.unFollowUser(targetUserId)
        follower.is_following = false
      } else {
        await accountStore.followUser(targetUserId)
        follower.is_following = true
      }
      
      // 팔로우/언팔로우 후 사용자 정보 새로고침
      await accountStore.getUserInfo()
      const userId = props.targetUserId || accountStore.user?.user_id
      if (userId) {
        await loadFollowing(userId)
      }
    } else {
      // 팔로잉 탭에서는 언팔로우만 가능
      await accountStore.unFollowUser(targetUserId)
      following.value = following.value.filter(u => u.user_id !== targetUserId)
      
      // 언팔로우 후 사용자 정보 새로고침
      await accountStore.getUserInfo()
    }
  } catch (error) {
    console.error('팔로우 토글 실패:', error)
  }
}
</script>
