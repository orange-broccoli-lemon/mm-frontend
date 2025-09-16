<template>
  <h1>🔥 인기 영화 TOP 10</h1>
    <PopularMovieCarousel :movies="movieStore.popularMovies" />
    <hr>
    <h1>추천 영화</h1>
    <div class="cardgrid">
      <RouterLink
        v-for="(movie, index) in movieStore.movieList"
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
  <!-- 인기 영화 캐루셀 -->

</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useMovieStore } from "../stores/movie"
import MovieCard from "../components/MovieCard.vue"
import PopularMovieCarousel from "../components/PopularMovieCarousel.vue"
const movieStore = useMovieStore()


onMounted(() => {
  movieStore.allMovies()
  movieStore.fetchPopularMovies()
})

</script>

<style scoped>
.cardgrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}
a {
  text-decoration: none;
}
</style>