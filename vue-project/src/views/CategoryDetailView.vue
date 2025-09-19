<template>
  <main class="category-detail min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-4 px-4">
    <div class="max-w-7xl mx-auto space-y-12">
      <section class="genre-section">
        <!-- 장르 제목 -->
        <div class="flex items-center gap-3 mb-6 section-header">
          <div class="w-1 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            {{ genre?.name }}
          </h2>
        </div>

        <!-- 영화 카드 그리드 -->
        <div v-if="movies.length > 0" class="movie-grid">
          <RouterLink
            v-for="(movie, index) in movies"
            :key="movie.movie_id"
            :to="{ name: 'movie-detail', params: { id: movie.movie_id } }"
            class="movie-link genre-movie-card"
            :style="{ animationDelay: `${index * 80}ms` }"
          >
            <MovieCard
              :title="movie.title"
              :image="movie.poster_url || '/images/default-poster.png'"
              :movie_id="movie.movie_id"
            />
          </RouterLink>
        </div>

        <!-- 로딩 상태 -->
        <div v-else class="loading-state">
          <div class="loading-spinner"></div>
          <p>영화를 불러오는 중...</p>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCategoryStore, type Genre, type Movie } from '@/stores/category'
import MovieCard from '@/components/MovieCard.vue'

const route = useRoute()
const categoryStore = useCategoryStore()

const genre = ref<Genre | null>(null)
const movies = ref<Movie[]>([])

onMounted(async () => {
  const genreId = Number(route.params.genreId)

  // 장르 정보 가져오기
  if (categoryStore.allGenres.length === 0) {
    await categoryStore.fetchAllGenres()
  }
  genre.value = categoryStore.allGenres.find(g => g.genre_id === genreId) || null

  // 영화 목록 가져오기
  await categoryStore.fetchMoviesByGenre(genreId)
  movies.value = categoryStore.getMoviesByGenre(genreId)
})
</script>

<style scoped>
/* 공통 스타일 (HotMovieDetail 과 맞춤) */
.category-detail {
  font-family: "Noto Sans KR", sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.dark .category-detail {
  background-color: #111827;
  color: #f9fafb;
}

/* Section Header */
.section-header {
  opacity: 0;
  transform: translateY(-20px);
  animation: slideInDown 0.8s ease-out forwards;
}
@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 영화 그리드 */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

/* 카드 */
.movie-link {
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  overflow: hidden;
}
.movie-link:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}
.dark .movie-link:hover {
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
}

/* 카드 진입 애니메이션 */
.genre-movie-card {
  opacity: 0;
  transform: translateY(40px) scale(0.9);
  animation: slideInScale 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes slideInScale {
  from { opacity: 0; transform: translateY(40px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* 섹션 애니메이션 */
.genre-section {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeSlideIn 0.9s ease-out forwards;
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 로딩 상태 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: #6b7280;
}
.dark .loading-state { color: #9ca3af; }

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}
.dark .loading-spinner {
  border-color: #374151;
  border-top-color: #60a5fa;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 반응형 */
@media (max-width: 1024px) {
  .movie-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.25rem; }
}
@media (max-width: 768px) {
  .movie-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
}
@media (max-width: 480px) {
  .movie-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.75rem; }
}
</style>
