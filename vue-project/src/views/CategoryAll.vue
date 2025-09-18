<template>
  <main class="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300 py-4 px-4">
    <div class="max-w-7xl mx-auto space-y-8">
      <section v-for="genre in genres" :key="genre.genre_id">
        <!-- 장르 제목 -->
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-between">
          {{ genre.name }}
        </h2>

        <!-- 영화 카드 그리드 -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <RouterLink
            v-for="movie in getMoviesByGenre(genre.genre_id)"
            :key="movie.movie_id"
            :to="movieDetailLink(movie.movie_id)"
            class="group transition-transform duration-200 hover:-translate-y-1"
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
  name: 'BookDetail',
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
