<template>
  <h1>🔥 인기 영화 목록</h1>
 <div class="cardgrid">
  <h1>캐루셀</h1> <hr>
  <h1>캐루셀 아래부분 동글뱅이</h1><hr>

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
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import { useMovieStore } from "../stores/movie"
import MovieCard from "../components/MovieCard.vue"
const movieStore = useMovieStore()

onMounted(() => {
  movieStore.allMovies()
})

</script>

<style scoped>
.cardgrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem; 
}
a {
  text-decoration: none;
}
</style>