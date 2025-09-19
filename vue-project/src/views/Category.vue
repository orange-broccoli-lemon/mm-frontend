<template>
  <main class="bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="py-4 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="flex items-baseline justify-between mb-6 section-header">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            장르
            </h1>
          </div>
          <button
            class="group relative w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
            @click="toggleGenres"
          >
            <span class="text-green-500 hover:text-green-600 text-xl font-bold group-hover:rotate-90 transition-all duration-300">
              {{ showAll ? '-' : '+' }}
            </span>
            <div
              class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {{ showAll ? '접기' : '더보기' }}
            </div>
          </button>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="isLoading && displayGenres.length === 0"
             class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div v-for="n in 5" :key="n" class="skeleton-genre-button">
            <div class="skeleton-genre-text"></div>
          </div>
        </div>

        <!-- ✅ 단일 grid: 5개 + (펼치면) 나머지 -->
        <transition-group
          v-else
          name="genre-list"
          tag="div"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          <button
            v-for="(genre, index) in visibleGenres"
            :key="genre.genre_id"
            class="genre-button group genre-card w-full"
            :style="staggerStyle(index)"
            @click="handleGenreClick(genre)"
          >
            <span class="genre-name">{{ genre.name }}</span>
          </button>
        </transition-group>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()
const router = useRouter()

// 토글 상태
const showAll = ref(false)

// 로딩 상태
const isLoading = computed(() => categoryStore.isLoadingPopularGenres || categoryStore.isLoadingAllGenres)

// 인기 장르 5개
const displayGenres = computed(() => categoryStore.popularGenres.slice(0, 5))

// 나머지 (전체에서 인기 5개 제외)
const remainingGenres = computed(() =>
  categoryStore.allGenres.filter(g => !displayGenres.value.some(pg => pg.genre_id === g.genre_id))
)

// ✅ 펼침 여부에 따라 한 리스트로 묶어서 렌더
const visibleGenres = computed(() =>
  showAll.value ? [...displayGenres.value, ...remainingGenres.value] : displayGenres.value
)

// ✅ 첫 5개는 딜레이 없음, 6번째부터 차라락
const staggerStyle = (index: number) => {
  if (!showAll.value) return { animationDelay: `${index * 80}ms` } // 초기 5개도 살짝 딜레이 원하면 유지
  return index < 5 ? {} : { animationDelay: `${(index - 5) * 80}ms` }
}

// 장르 클릭 → 상세 페이지 이동
const handleGenreClick = (genre: any) => {
  router.push({ name: 'category-detail', params: { genreId: genre.genre_id } })
}

// 더보기/접기 토글
const toggleGenres = async () => {
  if (!showAll.value && categoryStore.allGenres.length === 0) {
    await categoryStore.fetchAllGenres()
  }
  showAll.value = !showAll.value
}

// 마운트 시 인기 장르 데이터 로드
onMounted(async () => {
  await categoryStore.fetchPopularGenres()
})
</script>

<style scoped>
/* 기존 버튼 스타일 그대로 */
.genre-button {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 80px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.genre-button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-color: #d1d5db; }
.genre-button:active { transform: translateY(0); }
.genre-name { font-size: 14px; font-weight: 600; color: #1f2937; text-align: center; }
.dark .genre-button { background: #374151; border-color: #4b5563; }
.dark .genre-name { color: #f9fafb; }

/* grid 내부에서 아이템 차라락 */
.genre-card {
  opacity: 0;
  transform: translateY(16px);
  animation: fadeSlideIn 0.35s ease forwards;
}
@keyframes fadeSlideIn {
  to { opacity: 1; transform: translateY(0); }
}

/* 스켈레톤은 기존 그대로라 생략 */
</style>
