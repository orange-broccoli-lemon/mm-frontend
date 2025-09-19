<template>
  <main class="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300 py-4 px-4">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- 장르 선택 버튼들 -->
      <div class="genre-selector-section animate-fade-in">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          장르별 영화
        </h1>
        <div class="flex flex-wrap justify-center gap-3 mb-8">
          <button
            v-for="genre in genres"
            :key="genre.genre_id"
            @click="selectGenre(genre.genre_id)"
            :class="[
              'genre-button px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105',
              selectedGenreId === genre.genre_id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300'
            ]"
          >
            {{ genre.name }}
          </button>
        </div>
      </div>

      <!-- 선택된 장르의 영화들 -->
      <div v-if="selectedGenreId" class="selected-genre-section animate-slide-up">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ getSelectedGenreName() }} 영화
          </h2>
          <span class="text-gray-500 dark:text-gray-400">
            ({{ getMoviesByGenre(selectedGenreId).length }}개)
          </span>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="isLoadingMovies" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span class="ml-3 text-gray-600 dark:text-gray-400">영화를 불러오는 중...</span>
        </div>

        <!-- 영화 카드 그리드 -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <RouterLink
            v-for="(movie, movieIndex) in getMoviesByGenre(selectedGenreId)"
            :key="movie.movie_id"
            :to="movieDetailLink(movie.movie_id)"
            class="movie-card-link group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
            :style="{ animationDelay: `${movieIndex * 50}ms` }"
          >
            <MovieCard
              :title="movie.title"
              :image="movie.poster_url || '/images/default-poster.png'"
              :movie_id="movie.movie_id"
            />
          </RouterLink>
        </div>

        <!-- 영화가 없는 경우 -->
        <div v-if="!isLoadingMovies && getMoviesByGenre(selectedGenreId).length === 0" class="text-center py-12">
          <div class="text-4xl mb-4">🎬</div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            이 장르의 영화가 없습니다
          </h3>
          <p class="text-gray-600 dark:text-gray-400">다른 장르를 선택해보세요!</p>
        </div>
      </div>

      <!-- 장르를 선택하지 않은 경우 -->
      <div v-else class="text-center py-12 animate-fade-in">
        <div class="text-6xl mb-6">🎭</div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          관심 있는 장르를 선택해보세요
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-lg">
          위의 장르 버튼을 클릭하면 해당 장르의 영화들을 볼 수 있습니다
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onActivated, ref } from 'vue'
import { useCategoryStore, type Genre, type Movie } from '@/stores/category'
import MovieCard from '@/components/MovieCard.vue'

const categoryStore = useCategoryStore()
const genres = ref<Genre[]>([])
const selectedGenreId = ref<number | null>(null)
const isLoadingMovies = ref(false)

const didInitialScroll = ref(false)

const safeScrollTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 영화 상세 링크 생성 함수
const movieDetailLink = (movieId: number) => ({
  name: 'movie-detail',
  params: { id: movieId }
})

// 장르 선택 함수
const selectGenre = async (genreId: number) => {
  selectedGenreId.value = genreId
  isLoadingMovies.value = true
  
  try {
    // 해당 장르의 영화가 아직 로드되지 않았다면 로드
    if (categoryStore.getMoviesByGenre(genreId).length === 0) {
      await categoryStore.fetchMoviesByGenre(genreId)
    }
  } finally {
    isLoadingMovies.value = false
  }
}

// 선택된 장르 이름 가져오기
const getSelectedGenreName = (): string => {
  const genre = genres.value.find(g => g.genre_id === selectedGenreId.value)
  return genre ? genre.name : ''
}

// 장르 로드
const loadGenres = async () => {
  if (!categoryStore.isPopularGenresLoaded) {
    await categoryStore.fetchPopularGenres()
  }
  genres.value = categoryStore.popularGenres
  
  // 액션 장르를 찾아서 자동 선택
  const actionGenre = genres.value.find(genre => 
    genre.name.toLowerCase().includes('액션') || 
    genre.name.toLowerCase().includes('action')
  )
  
  if (actionGenre && !selectedGenreId.value) {
    await selectGenre(actionGenre.genre_id)
  }
}

const init = async () => {
  if (!didInitialScroll.value) {
    safeScrollTop()
    didInitialScroll.value = true
  }
  await loadGenres()
}

onMounted(init)
onActivated(init)

const getMoviesByGenre = (genreId: number): Movie[] =>
  categoryStore.getMoviesByGenre(genreId)
</script>

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
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}

/* 장르 버튼 스타일 */
.genre-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.genre-button:hover {
  transform: translateY(-2px);
}

.genre-button:active {
  transform: translateY(0);
}

/* Movie Card Link Animation */
.movie-card-link {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  animation: cardSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Enhanced hover effects */
.movie-card-link:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.dark .movie-card-link:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* 반응형 디자인 */
@media (max-width: 640px) {
  .genre-button {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
}
</style>
