<template>
  <div v-if="movieDetail" class="movie-detail">

    <div class="movie-hero">
      <img :src="movieDetail.backdrop_url" class="backdrop" />
      <img :src="movieDetail.poster_url" class="poster" />
    </div>


    <div class="movie-content">
      <div class="info">
        <h1>{{ movieDetail.title }}</h1>
        <p>{{ movieDetail.overview }}</p>
        <div class="rating">
          <span>{{ movieDetail.average_rating.toFixed(1) }}</span>
          <span v-for="n in 5" :key="n">
            <template v-if="n <= Math.floor(movieDetail.average_rating)">★</template>
            <template v-else-if="n - 0.5 <= movieDetail.average_rating">⯪</template>
            <template v-else>☆</template>
          </span>
        </div>
      </div>
      <div class="actions">
        <button class="save" @click = "saevMovie">저장</button>
        <button class="comment" @click="goCreate">코멘트</button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref, onMounted} from 'vue'
import { useMovieStore } from '@/stores/movie'
import type { DetailMovie } from '@/stores/movie'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()


const userMovie = useMovieStore()
const movieDetail = ref<DetailMovie | null>(null)

onMounted(async () => {
  const res = await userMovie.detailMovie(1)
  movieDetail.value = res
})

const goCreate = () => {
  router.push({ name: 'CreateThread', params: { id: route.params.id } })
}

const saevMovie = () => {
  const id = route.params.id  
  // store.SaveMovie(id)          
  }
</script>

<style scoped>
.movie-detail-page {
  display: flex;
  flex-direction: column;
  background: #f7f9fb;
}

.movie-background {
  width: 100%;
  height: 200px;
  overflow: hidden;
}
.movie-background .backdrop {
  width: 100%;
  object-fit: cover;
  height: 100%;
}

.movie-content {
  display: flex;
  padding: 20px;
}

.poster img {
  width: 200px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}

.info {
  flex: 1;
  margin-left: 20px;
}

.title {
  font-size: 2rem;
  margin-bottom: 10px;
}

.overview {
  font-size: 1rem;
  color: #333;
  margin-bottom: 20px;
}

.movie-rating {
  color: orange;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.rating-number {
  font-weight: bold;
  margin-right: 10px;
}

.buttons {
  display: flex;
  gap: 10px;
}
.buttons button {
  background: #fff;
  border: 1px solid #ddd;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}
.buttons button:hover {
  background: #f0f0f0;
}
</style>
