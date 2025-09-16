<template>
  <main>
    <h1>🔥 인기 영화 <RouterLink class="plus" to="HotMovieDetailView">+</RouterLink></h1>
    <div class="cardgrid">
      <RouterLink
        v-for="(movie, index) in movieStore.popularMovies.slice(0,5)"
        :key="index"
        :to="{ name: 'BookDetail', params: { id: movie.movie_id } }"
      >
        <MovieCard
          :title="movie.title"
          :image="movie.poster_url"
          :movie_id = "movie.movie_id"
        />
      </RouterLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useMovieStore } from "../stores/movie"
import MovieCard from "../components/MovieCard.vue"
import { RouterLink } from "vue-router"

const movieStore = useMovieStore()

onMounted(() => {
  movieStore.fetchPopularMovies()
})

</script>

<style scoped>
.cardgrid {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}
a {
  text-decoration: none;
}

</style>