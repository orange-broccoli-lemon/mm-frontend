<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-16">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200 mx-auto mb-4"></div>
        <p class="text-gray-600 dark:text-gray-400 text-lg">배우 정보를 불러오는 중...</p>
      </div>
    </div>

    <!-- 배우 상세 정보 -->
    <div v-else-if="store.actorDetails" class="max-w-6xl mx-auto px-4 py-8">
      <!-- 헤더 섹션 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- 배우 이미지 -->
          <div class="flex-shrink-0">
            <img 
              :src="store.actorDetails.profile_image_url || spottiImage" 
              :alt="store.actorDetails.name"
              class="w-64 h-80 lg:w-80 lg:h-96 object-cover rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
            />
          </div>
          
          <!-- 배우 기본 정보 -->
          <div class="flex-1">
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {{ store.actorDetails.name }}
            </h1>
            
            <div class="space-y-3 mb-6">
              <div v-if="store.actorDetails.original_name" class="flex items-center">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">원본명:</span>
                <span class="text-gray-900 dark:text-gray-100">{{ store.actorDetails.original_name }}</span>
              </div>
              
              <div v-if="store.actorDetails.birthday" class="flex items-center">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">생년월일:</span>
                <span class="text-gray-900 dark:text-gray-100">{{ formatDate(store.actorDetails.birthday) }}</span>
              </div>
              
              <div v-if="store.actorDetails.deathday" class="flex items-center">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">사망일:</span>
                <span class="text-gray-900 dark:text-gray-100">{{ formatDate(store.actorDetails.deathday) }}</span>
              </div>
              
              <div v-if="store.actorDetails.place_of_birth" class="flex items-center">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">출생지:</span>
                <span class="text-gray-900 dark:text-gray-100">{{ store.actorDetails.place_of_birth }}</span>
              </div>
              
              <div v-if="store.actorDetails.known_for_department" class="flex items-center">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">전문분야:</span>
                <span class="text-gray-900 dark:text-gray-100">{{ store.actorDetails.known_for_department }}</span>
              </div>
              
              <div class="flex items-center">
                <span class="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">인기도:</span>
                <div class="flex items-center gap-2">
                  <div class="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      class="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                      :style="{ width: `${Math.min(store.actorDetails.popularity, 100)}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">{{ store.actorDetails.popularity.toFixed(1) }}</span>
                </div>
              </div>
            </div>
            
            <!-- 팔로우 섹션 -->
            <div class="flex items-center gap-4">
              <button 
                @click="toggleFollow" 
                :class="[
                  'px-6 py-3 rounded-lg font-medium transition-all duration-200',
                  isFollowing 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600' 
                    : 'bg-gray-800 dark:bg-gray-600 hover:bg-gray-900 dark:hover:bg-gray-500 text-white'
                ]"
              >
                {{ isFollowing ? '팔로잉' : '팔로우' }}
              </button>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-medium">{{ followersCount }}</span>명이 팔로우 중
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 바이오그래피 섹션 -->
      <div v-if="store.actorDetails.biography" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <span class="text-2xl">📖</span>
          바이오그래피
        </h2>
        <div class="prose prose-gray dark:prose-invert max-w-none">
          <p class="text-gray-800 dark:text-gray-200 leading-relaxed text-lg whitespace-pre-line">
            {{ store.actorDetails.biography }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useActorStore } from '@/stores/actor'
import spottiImage from '@/assets/spotti.png'

const route = useRoute()
const store = useActorStore()

const isFollowing = ref(false)
const followersCount = ref(0)
const loading = ref(true)

const fetchActorDetail = async (id: number) => {
  loading.value = true
  store.actorDetails = null   // 🔥 이전 배우 데이터 초기화
  await store.getActorDetail(id)
  if (store.actorDetails) {
    isFollowing.value = (store.actorDetails as any).is_following || false
    followersCount.value = (store.actorDetails as any).followers_count || 0
  }
  loading.value = false
}

onMounted(() => {
  const personId = Number(route.params.id)
  if (personId) fetchActorDetail(personId)
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) fetchActorDetail(Number(newId))
  }
)

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
  if (isFollowing.value) {
    followersCount.value++
  } else {
    followersCount.value--
  }
  // TODO: API 호출해서 팔로우 상태 동기화
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}
</script>

