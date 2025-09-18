<template>
  <main class="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300 py-4 px-4">
    <div class="max-w-7xl mx-auto space-y-8">
      <section v-for="genre in genres" :key="genre.genre_id">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {{ genre.name }}
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <RouterLink
            v-for="movie in getMoviesByGenre(genre.genre_id)"
            :key="movie.movie_id"
            :to="{ name: 'CategoryDetailView', params: { genreId: genre.genre_id } }"
            class="group transition-transform duration-200 hover:-translate-y-1"
          >
            <MovieCard
              :title="movie.title"
              :image="movie.poster_url"
              :movie_id="movie.movie_id"
            />
          </RouterLink>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCategoryStore, type Genre, type Movie } from '@/stores/category'
import MovieCard from '@/components/MovieCard.vue'

const categoryStore = useCategoryStore()
const genres = ref<Genre[]>([])

onMounted(async () => {
  if (!categoryStore.isPopularGenresLoaded) {
    await categoryStore.fetchPopularGenres()
  }
  genres.value = categoryStore.popularGenres

  for (const genre of genres.value) {
    if (categoryStore.getMoviesByGenre(genre.genre_id).length === 0) {
      await categoryStore.fetchMoviesByGenre(genre.genre_id)
    }
  }
})

const getMoviesByGenre = (genreId: number): Movie[] => categoryStore.getMoviesByGenre(genreId)
</script>


<style scoped> 

</style>
