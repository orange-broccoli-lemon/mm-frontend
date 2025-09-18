<template>
  <div class="carousel">
    <button @click="prev" class="carousel-btn">&#8592;</button>
    <div class="carousel-track">
      <RouterLink
        v-for="(movie, idx) in visibleMovies"
        :key="movie.movie_id"
        :to="{ name: 'movie-detail', params: { id: movie.movie_id } }"
        class="carousel-item"
        :class="{
          'left-tilt': idx === 0,
          'right-tilt': idx === visibleMovies.length - 1
        }"
      >
        <img :src="movie.backdrop_url" :alt="movie.title" class="carousel-img" />
        <div class="carousel-title">{{ movie.title }}</div>
      </RouterLink>
    </div>
    <button @click="next" class="carousel-btn">&#8594;</button>
  </div>
  <div class="carousel-indicators">
    <span
      v-for="i in Math.max(props.movies.length - visibleCount + 1, 1)"
      :key="i"
      :class="['dot', { active: current === i - 1 }]"
      @click="goTo(i - 1)"
      style="cursor:pointer;"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MovieList } from '../stores/movie'

const props = defineProps<{ movies: MovieList[] }>()
const current = ref(0)
const visibleCount = 3

const visibleMovies = computed(() => {
  return props.movies.slice(current.value, current.value + visibleCount)
})

function prev() {
  if (current.value > 0) current.value--
}
function next() {
  if (current.value < props.movies.length - visibleCount) current.value++
}

function goTo(idx: number) {
  current.value = idx
}
</script>

<style scoped>
 .carousel {
  display: flex;
  align-items: center;
  margin: 2rem 0;
  max-width: 1700px;
  margin-left: auto;
  margin-right: auto;
}
.carousel-track {
  display: flex;
  overflow: hidden;
  width: 100%;
  gap: 10px;
}
.carousel-item {
  flex: 1;
  text-align: center;
}
.carousel-img {
  width: 105%;
  height: 450px;
  object-fit: cover;
  border-radius: 16px;
}

.left-tilt {
  transform: perspective(800px) rotateY(20deg);
  transition: transform 0.4s;
}
.right-tilt {
  transform: perspective(800px) rotateY(-20deg);
  transition: transform 0.4s;
}
.carousel-title {
  margin-top: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
}
.carousel-btn {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #eee;
  margin: 0 4px;
  display: inline-block;
  transition: background 0.3s;
}
.dot.active {
  background: #111;
}
</style>
