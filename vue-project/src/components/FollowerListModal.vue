<template>
  <!-- 모달 오버레이 -->
  <div 
    v-if="isOpen" 
    class="fixed inset-0 flex items-center justify-center z-50"
    @click="closeModal"
  >
    <!-- 모달 컨텐츠 -->
    <div 
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 w-[800px] h-[700px] mx-4 overflow-hidden"
      @click.stop
    >
      <!-- 모달 헤더 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
          팔로워 목록
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

      <!-- 로딩 상태 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-gray-200"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-400">팔로워 목록을 불러오는 중...</span>
      </div>

      <!-- 팔로워 목록 -->
      <div v-else-if="followers.length > 0" class="h-[580px] overflow-y-auto">
        <div class="p-4 space-y-3">
          <div
            v-for="follower in followers"
            :key="follower.user_id"
            class="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border border-gray-100 dark:border-gray-700"
          >
            <!-- 프로필 이미지 -->
            <img
              :src="follower.profile_image_url || defaultProfileImage"
              :alt="follower.name"
              class="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-600"
            />
            
            <!-- 사용자 정보 -->
            <div class="flex-1 min-w-0">
              <h4 class="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
                {{ follower.name }}
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                {{ follower.email }}
              </p>
            </div>

            <!-- 팔로우 버튼 -->
            <button
              v-if="follower.user_id !== currentUserId"
              @click="toggleFollow(follower.user_id)"
              :class="[
                'px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200',
                follower.is_following 
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600'
                  : 'bg-gray-800 dark:bg-gray-600 text-white hover:bg-gray-900 dark:hover:bg-gray-500'
              ]"
            >
              {{ follower.is_following ? '팔로잉' : '팔로우' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 팔로워가 없는 경우 -->
      <div v-else class="flex flex-col items-center justify-center py-12">
        <div class="text-6xl mb-4">👥</div>
        <h4 class="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">팔로워가 없습니다</h4>
        <p class="text-gray-600 dark:text-gray-400">아직 이 배우를 팔로우하는 사용자가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAccountStore } from '@/stores/user'
import defaultProfileImage from '@/assets/spotti.png'

interface Follower {
  user_id: number
  name: string
  email: string
  profile_image_url?: string
  is_following?: boolean
}

const props = defineProps<{
  isOpen: boolean
  actorId: number
}>()

const emit = defineEmits<{
  close: []
}>()

const accountStore = useAccountStore()
const followers = ref<Follower[]>([])
const loading = ref(false)
const currentUserId = ref(accountStore.userId)

// 모달이 열릴 때 팔로워 목록 로드
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen && props.actorId) {
    await loadFollowers()
  }
})

const loadFollowers = async () => {
  loading.value = true
  try {
    const data = await accountStore.getFollowers(props.actorId)
    followers.value = data || []
    console.log('팔로워 목록 로드 완료:', followers.value)
  } catch (error) {
    console.error('팔로워 목록 로드 실패:', error)
    followers.value = []
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  emit('close')
}

const toggleFollow = async (targetUserId: number) => {
  try {
    const follower = followers.value.find(f => f.user_id === targetUserId)
    if (!follower) return

    if (follower.is_following) {
      await accountStore.unFollowUser(targetUserId)
      follower.is_following = false
    } else {
      await accountStore.followUser(targetUserId)
      follower.is_following = true
    }
  } catch (error) {
    console.error('팔로우 토글 실패:', error)
  }
}
</script>
