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
            <!-- 프로필 이미지 -->
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

            <!-- 팔로우 버튼 (주소 끝이 mypage일 때만 보임) -->
            <button
              v-if="lastPathSegment === 'mypage' && follower.user_id !== currentUserId"
              @click="toggleFollow(follower.user_id)"
              :class="[
                'px-3 py-1 text-xs rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 border',
                follower.is_following 
                  ? 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300 hover:border-blue-400'
                  : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600 hover:border-blue-700'
              ]"
            >
              {{ follower.is_following ? '팔로잉' : '팔로우' }}
            </button>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-8">
          <div class="text-4xl mb-4">👥</div>
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">팔로워가 없습니다</h4>
          <p class="text-gray-600 dark:text-gray-400 text-sm">아직 나를 팔로우하는 사용자가 없습니다.</p>
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
            <!-- 프로필 이미지 -->
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

            <!-- 언팔로우 버튼 (주소 끝이 mypage일 때만 보임) -->
            <button
              v-if="lastPathSegment === 'mypage' && user.user_id !== currentUserId"
              @click="toggleFollow(user.user_id)"
              class="px-3 py-1 text-xs rounded-lg font-medium bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-white dark:hover:bg-gray-100 dark:text-black shadow-sm hover:shadow-md transition-all duration-200 border border-blue-300 hover:border-blue-400 dark:border-gray-300"
            >
              팔로잉
            </button>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center py-8">
          <div class="text-4xl mb-4">👤</div>
          <h4 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">팔로잉이 없습니다</h4>
          <p class="text-gray-600 dark:text-gray-400 text-sm">아직 팔로우하는 사용자가 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
  targetUserId?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const route = useRoute()
const accountStore = useAccountStore()

const activeTab = ref<'followers' | 'following'>('followers')
const followers = ref<User[]>([])
const following = ref<User[]>([])
const loading = ref(false)
const currentUserId = ref(accountStore.userId)

// 주소 맨 끝 segment (예: /mypage → 'mypage', /mypage/123 → '123')
const lastPathSegment = route.fullPath.split('/').pop()

// 드래그 관련 상태
const modalRef = ref<HTMLElement>()
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

const startDrag = (e: MouseEvent) => {
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

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return
  position.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

onUnmounted(async () => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)

  await accountStore.getUserInfo()
  await loadData()
})

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    position.value = { x: 0, y: 0 }
    await accountStore.getUserInfo()
    await loadData()
  }
})

const loadData = async () => {
  const userId = props.targetUserId || accountStore.user?.user_id
  if (!userId) return
  loading.value = true
  try {
    await Promise.all([loadFollowers(userId), loadFollowing(userId)])
  } finally {
    loading.value = false
  }
}

const loadFollowers = async (userId: number) => {
  try {
    const data = await accountStore.getFollowers(userId)
    if (Array.isArray(data)) {
      followers.value = data
    } else if (data && typeof data === 'object') {
      followers.value = data.users || data.followers || data.results || []
    } else {
      followers.value = []
    }
  } catch {
    followers.value = []
  }
}

const loadFollowing = async (userId: number) => {
  try {
    const data = await accountStore.getFollowing(userId)
    if (Array.isArray(data)) {
      following.value = data
    } else if (data && typeof data === 'object') {
      following.value = data.users || data.following || data.results || []
    } else {
      following.value = []
    }
  } catch {
    following.value = []
  }
}

const closeModal = () => {
  emit('close')
}

const goToUserProfile = (userId: number) => {
  closeModal()

  if(userId == accountStore.user?.user_id)
  {
      router.push('/mypage')
  }
  else{
    router.push({ name: 'UserProfile', params: { userId: userId.toString() } })
  }
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
      await accountStore.getUserInfo()
      const userId = props.targetUserId || accountStore.user?.user_id
      if (userId) await loadFollowing(userId)
    } else {
      await accountStore.unFollowUser(targetUserId)
      following.value = following.value.filter(u => u.user_id !== targetUserId)
      await accountStore.getUserInfo()
    }
  } catch (error) {
    console.error('팔로우 토글 실패:', error)
  }
}
</script>
