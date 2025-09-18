<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 pt-16">
    <!-- 스켈레톤 로딩 상태 -->
    <div v-if="loading" class="max-w-6xl mx-auto px-4 py-8">
      <!-- 헤더 섹션 스켈레톤 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- 배우 이미지 스켈레톤 -->
          <div class="flex-shrink-0">
            <div class="w-64 h-80 lg:w-80 lg:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
          
          <!-- 배우 정보 스켈레톤 -->
          <div class="flex-1 space-y-4">
            <!-- 이름 스켈레톤 -->
            <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            
            <!-- 정보 항목들 스켈레톤 -->
            <div class="space-y-3">
              <div class="flex items-center gap-4">
                <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div class="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div class="w-28 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div class="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
            
            <!-- 팔로우 버튼 스켈레톤 -->
            <div class="flex items-center gap-4 mt-6">
              <div class="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 바이오그래피 섹션 스켈레톤 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mb-6"></div>
        <div class="space-y-3">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
        </div>
      </div>

      <!-- 출연작 섹션 스켈레톤 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mb-6"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="space-y-3">
            <div class="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 배우 상세 정보 -->
    <div v-else-if="store.actorDetails" class="max-w-6xl mx-auto px-4 py-8">
      <!-- 헤더 섹션 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8 animate-fade-in">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- 배우 이미지 -->
          <div class="flex-shrink-0 animate-scale-in">
            <img 
              :src="store.actorDetails.profile_image_url || spottiImage" 
              :alt="store.actorDetails.name"
              class="w-64 h-80 lg:w-80 lg:h-96 object-cover rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
            />
          </div>
          
          <!-- 배우 기본 정보 -->
          <div class="flex-1 animate-slide-in-right">
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
                   <div class="flex items-center gap-4 animate-fade-in-delayed">
                     <button
                       @click="toggleFollow"
                       :class="[
                         'px-6 py-3 rounded-lg font-medium transition-all duration-200',
                         isFollowing
                           ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600'
                           : 'bg-gray-800 dark:bg-gray-600 hover:bg-gray-900 dark:hover:bg-gray-500 text-white'
                       ]"
                     >
                       {{ isFollowing ? '좋아요 취소' : '좋아요' }}
                     </button>
                     <button
                       @click="showFollowerListModal = true"
                       class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 cursor-pointer"
                     >
                       <span class="font-medium">❤️: {{ store.actorDetails.followers_count }}</span>
                     </button>
                   </div>
          </div>
        </div>
      </div>

      <!-- 바이오그래피 섹션 -->
      <div v-if="store.actorDetails.biography" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8 animate-slide-up">
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

      <!-- 출연작 섹션 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 animate-slide-up-delayed">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <span class="text-2xl">🎬</span>
          출연작
          <span v-if="store.actorCredits.length > 0" class="text-lg font-normal text-gray-500 dark:text-gray-400">
            ({{ store.actorCredits.length }}편)
          </span>
        </h2>

        <!-- 출연작 로딩 상태 -->
        <div v-if="store.creditsLoading" class="space-y-6">
          <div class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800 dark:border-gray-200"></div>
          <span class="ml-3 text-gray-600 dark:text-gray-400">출연작을 불러오는 중...</span>
          </div>
          <!-- 출연작 스켈레톤 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="i in 4" :key="i" class="space-y-3">
              <div class="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>

        <!-- 출연작 목록 -->
        <div v-else-if="store.actorCredits.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="(credit, index) in store.actorCredits"
            :key="credit.movie_id"
            class="group cursor-pointer transition-transform duration-200 hover:-translate-y-1 animate-fade-in-delayed"
            :style="{ animationDelay: `${0.1 + index * 0.05}s` }"
            @click="goToMovie(credit.movie_id)"
          >
            <!-- 영화 포스터 -->
            <div class="relative overflow-hidden rounded-lg shadow-md mb-3">
              <img
                :src="credit.movie_poster_url || '/src/assets/spotti.png'"
                :alt="credit.movie_title"
                class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <!-- 영화 정보 -->
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate" :title="credit.movie_title">
                {{ credit.movie_title }}
              </h3>
              
           
                <div v-if="credit.job" class="text-sm text-gray-600 dark:text-gray-400">
                <div v-if ="credit.is_main_cast && credit.job == 'Actor' ">
                      <span class="font-medium">직책: 주연</span> 

                </div>
                <div v-else>
                  <span class="font-medium">직책:</span> {{ credit.job }}
                </div>
              </div>
              
              <div v-if="credit.release_date" class="text-sm text-gray-500 dark:text-gray-500">
                {{ formatDate(credit.release_date) }}
              </div>
              
              <div v-if="credit.is_main_cast" class="flex items-center gap-1">
                <span class="main-cast-badge text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-medium">
                  주연
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 출연작이 없는 경우 -->
        <div v-else class="text-center py-12">
          <div class="text-4xl mb-4">🎭</div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">출연작 정보가 없습니다</h3>
          <p class="text-gray-600 dark:text-gray-400">이 배우의 출연작 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    </div>

    <!-- 팔로워 목록 모달 -->
    <FollowerListModal
      :is-open="showFollowerListModal"
      :actor-id="Number(route.params.id)"
      @close="showFollowerListModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useActorStore } from '@/stores/actor'
import FollowerListModal from '@/components/FollowerListModal.vue'
import spottiImage from '@/assets/spotti.png'

const route = useRoute()
const router = useRouter()
const store = useActorStore()

const isFollowing = ref(false)
const followersCount = ref(0)
const loading = ref(true)
const showFollowerModal = ref(false)
const showFollowerListModal = ref(false)

const fetchActorDetail = async (id: number) => {
  loading.value = true
  store.actorDetails = null   // 🔥 이전 배우 데이터 초기화
  store.actorCredits = []     // 🔥 이전 출연작 데이터 초기화
  
  // 배우 기본 정보만 먼저 로드
  await store.getActorDetail(id)
  
  if (store.actorDetails) {
    isFollowing.value = (store.actorDetails as any).is_following || false
    followersCount.value = (store.actorDetails as any).followers_count || 0
  }
  loading.value = false
  
  // 출연작은 백그라운드에서 지연 로드
  setTimeout(() => {
    store.getActorCredits(id)
  }, 100)
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

const toggleFollow = async () => {
  if (isFollowing.value) {
    await store.unFollowActor(Number(route.params.id))
     console.log(store.actorDetails)
    isFollowing.value = false
  } else {
    await store.followActor(Number(route.params.id))
    isFollowing.value = true
  }
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

// 영화 상세 페이지로 이동
const goToMovie = (movieId: number) => {
  router.push({
    name: 'BookDetail',
    params: { id: movieId }
  })
}
</script>

<style scoped>
/* 주연 배지 다크모드 스타일 */
.main-cast-badge {
  background-color: #fbbf24 !important; /* yellow-400 */
  color: #92400e !important; /* yellow-800 */
  font-weight: 600 !important;
}

/* 다크모드에서 주연 배지 강제 스타일 */
html.dark .main-cast-badge {
  background-color: #fbbf24 !important; /* yellow-400 */
  color: #92400e !important; /* yellow-800 */
  font-weight: 600 !important;
  border: 1px solid #f59e0b !important; /* yellow-500 */
}

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

.animate-slide-up-delayed {
  animation: slideUp 0.8s ease-out 1.0s both;
}
</style>

