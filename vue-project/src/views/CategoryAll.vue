<template>
  <main class="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300 py-4 px-4">
    <div class="max-w-7xl mx-auto space-y-8">
      <section 
        v-for="(genre, genreIndex) in genres" 
        :key="genre.genre_id"
        class="genre-section"
        :style="{ animationDelay: `${genreIndex * 150}ms` }"
      >
        <!-- 장르 제목 -->
        <h2 class="genre-header text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
          {{ genre.name }}
        </h2>

        <!-- 영화 카드 그리드 -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <RouterLink
            v-for="(movie, movieIndex) in getMoviesByGenre(genre.genre_id)"
            :key="movie.movie_id"
            :to="movieDetailLink(movie.movie_id)"
            class="movie-card-link group transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
            :style="{ animationDelay: `${(genreIndex * 150) + (movieIndex * 50)}ms` }"
          >
            <MovieCard
              :title="movie.title"
              :image="movie.poster_url || '/images/default-poster.png'"
              :movie_id="movie.movie_id"
            />
          </RouterLink>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onActivated, ref } from 'vue'
import { useCategoryStore, type Genre, type Movie } from '@/stores/category'
import MovieCard from '@/components/MovieCard.vue'

const categoryStore = useCategoryStore()
const genres = ref<Genre[]>([])

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

// 장르 & 영화 로드
const loadGenres = async () => {
  if (!categoryStore.isPopularGenresLoaded) {
    await categoryStore.fetchPopularGenres()
  }
  genres.value = categoryStore.popularGenres

  // 장르별 영화 첫 페이지를 병렬로 로딩
  await Promise.all(
    genres.value.map(g => {
      if (categoryStore.getMoviesByGenre(g.genre_id).length === 0) {
        return categoryStore.fetchMoviesByGenre(g.genre_id)
      }
      return Promise.resolve()
    })
  )
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
/* Genre Section Entrance Animation */
.genre-section {
  opacity: 0;
  transform: translateY(30px);
  animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Genre Header Animation */
.genre-header {
  opacity: 0;
  transform: translateX(-20px);
  animation: slideInLeft 0.6s ease-out forwards;
  animation-delay: 0.2s;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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

/* Staggered animation delays for better visual flow */
.genre-section:nth-child(1) .genre-header {
  animation-delay: 0.2s;
}

.genre-section:nth-child(2) .genre-header {
  animation-delay: 0.4s;
}

.genre-section:nth-child(3) .genre-header {
  animation-delay: 0.6s;
}

.genre-section:nth-child(4) .genre-header {
  animation-delay: 0.8s;
}

.genre-section:nth-child(5) .genre-header {
  animation-delay: 1.0s;
}
</style>
