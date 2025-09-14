<script setup lang="ts">
import { onMounted } from "vue"
import { useMovieStore } from "../stores/movie"
import MovieCard from "../components/MovieCard.vue"

const movieStore = useMovieStore()

onMounted(() => {
  movieStore.allMovies()
})

</script>
<template>
  <main>
    <h1>🔥 인기 영화</h1>
    <div class="cardgrid">
      <MovieCard
        v-for="(movie, index) in movieStore.movieList"
        :key="index"
        :title="movie.title"
        :image="movie.image"
      />
    </div>
  </main>
</template>

<style scoped>
.cardgrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem; 
}
</style>
