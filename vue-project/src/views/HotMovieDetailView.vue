<template>
  <div class="hot-movie-detail min-h-screen bg-white dark:bg-gray-900">
    <!-- 메인 컨테이너 -->
    <div class="py-4 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- 인기 영화 섹션 -->
        <section class="mb-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              인기 영화 TOP 10
            </h1>
          </div>
          
          <div v-if="movieStore.popularMovies.length === 0" class="loading-state">
            <div class="loading-spinner"></div>
            <p>인기 영화를 불러오는 중...</p>
          </div>
          
          <div v-else class="movie-grid">
            <RouterLink
              v-for="(movie, index) in movieStore.popularMovies"
              :key="movie.movie_id"
              :to="{ name: 'BookDetail', params: { id: movie.movie_id } }"
              class="movie-link"
            >
              <MovieCard
                :title="movie.title"
                :image="movie.poster_url"
                :movie-id="movie.movie_id"
              />
            </RouterLink>
          </div>
        </section>

        <!-- 구분선 -->
        <div class="divider"></div>

        <!-- 추천 영화 섹션 -->
        <section class="mt-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              추천 영화
            </h2>
          </div>
          
          <div v-if="movieStore.movieList.length === 0" class="loading-state">
            <div class="loading-spinner"></div>
            <p>영화를 불러오는 중...</p>
          </div>
          
          <div v-else class="movie-grid">
            <RouterLink
              v-for="(movie, index) in movieStore.movieList"
              :key="movie.movie_id"
              :to="{ name: 'BookDetail', params: { id: movie.movie_id } }"
              class="movie-link"
            >
              <MovieCard
                :title="movie.title"
                :image="movie.poster_url"
                :movie-id="movie.movie_id"
              />
            </RouterLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useMovieStore } from "../stores/movie"
import MovieCard from "../components/MovieCard.vue"
const movieStore = useMovieStore()


onMounted(() => {
  movieStore.allMovies()
  movieStore.fetchPopularMovies()
})

</script>

<style scoped>
/* 메인 컨테이너 */
.hot-movie-detail {
  font-family: "Noto Sans KR", sans-serif;
  background-color: #ffffff;
  color: #111827;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dark .hot-movie-detail {
  background-color: #111827;
  color: #f9fafb;
}

/* 구분선 */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb 20%, #e5e7eb 80%, transparent);
  margin: 2rem 0;
}

.dark .divider {
  background: linear-gradient(90deg, transparent, #374151 20%, #374151 80%, transparent);
}

/* 영화 그리드 */
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.movie-link {
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.movie-link:hover {
  transform: translateY(-4px);
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

.dark .loading-state {
  color: #9ca3af;
}

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

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
  
  .divider {
    margin: 1.5rem 0;
  }
}

@media (max-width: 480px) {
  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem;
  }
}

/* 다크모드에서 전체 페이지 배경색 일관성 보장 */
.dark .hot-movie-detail::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #111827;
  z-index: -1;
  pointer-events: none;
}

.hot-movie-detail::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  z-index: -1;
  pointer-events: none;
}
</style>