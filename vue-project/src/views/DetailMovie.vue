<template>
  <div v-if="movieDetail" class="movie-detail">
    <div class="movie-hero">
      <img
        v-if="movieDetail.backdrop_url"
        :src="movieDetail.backdrop_url"
        class="backdrop"
      />
       <div v-else class="backdrop no-image">
        이미지 없음
  </div>
    </div>

    <div class="movie-bottom">
     <div class="movie-poster">
  <img v-if="movieDetail.poster_url" :src="movieDetail.poster_url" class="poster" />
  <div v-else class="poster no-image">이미지 없음</div>
  <span>평점 </span>
  <span>{{ movieDetail.average_rating }}</span>
</div>


      <div class="movie-content1">
        <div class="header">
          <h1>{{ movieDetail.title }}</h1>
          <div class="actions">
            <button class="like" @click="likeMovie">좋아요</button>
            <button class="save" @click="saveMovie">저장</button>
            <button class="comment" @click="goCreate">코멘트</button>
          </div>
        </div>
        <hr>
        <p>{{ movieDetail.overview || "줄거리가 아직 등록되지 않았습니다." }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useMovieStore } from "@/stores/movie";
import type { DetailMovie } from "@/stores/movie";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);

const userMovie = useMovieStore();
const movieDetail = ref<DetailMovie | null>(null);

onMounted(async () => {
  const res = await userMovie.detailMovie(id);
  movieDetail.value = res;
});

const goCreate = () => {
  router.push({ name: "CreateThread", params: { id: route.params.id } });
};

const saveMovie = () => {
  console.log("저장 버튼 클릭");
};

const likeMovie = () => {
  console.log("좋아요 버튼 클릭")
}
</script>

<style scoped>
.movie-detail {
  /* display: flex; */
  position:absolute;
  width: 100%;    
  flex-direction: column;
  font-family: "Noto Sans KR", sans-serif;
  background: #fff;
  color: #222;
}

.movie-hero {
  position: relative;
  width: 100%;
  height: 380px;
  overflow: hidden;
}

.movie-hero .backdrop {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  filter: brightness(60%);
}

.movie-bottom {
  display: flex;
  gap: 32px;
  max-width: 1380px;
  margin: -140px auto 0; 
  padding: 0 20px 20px;
  z-index: 2;
  position: relative;
  align-items: flex-start;
}

.movie-poster {
  flex-shrink: 0;
  display: flex;
  flex-direction: column; 
  align-items: center;   
  gap: 20px;             
}
.poster {
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
  background: #fff;
}

/* 정보 영역 */
.movie-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  padding: 24px;
  border-radius: 12px;
}

.movie-content1 {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  padding: 24px;
  margin: 160px auto 0;
  border-radius: 12px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.header h1 {
  font-size: 2rem;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 12px;
}

.actions button {
  padding: 8px 18px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  transition: 0.2s ease;
}

.actions .save {
  background: #ff8e3d;
  color: #fff;
}

.actions .save:hover {
  background: #ffa12e;
}

.actions .comment {
  background: #f5f5f5;
  border: 1px solid #ddd;
}

.actions .comment:hover {
  background: #eee;
}

.movie-content p {
  font-size: 1rem;
  color: #444;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .movie-bottom {
    flex-direction: column;
    align-items: center;
    margin-top: -100px;
    padding: 20px;
  }

  .poster {
    width: 180px;
    height: 270px;
  }

  .movie-content {
    text-align: center;
    width: 100%;
    padding: 16px;
  }

  .header {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .poster {
    width: 140px;
    height: 210px;
  }

  .movie-bottom {
    padding: 16px;
  }

  .movie-content p {
    font-size: 0.9rem;
  }
}

.backdrop.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  background: #999; /* 이미지 없을 때 배경 */
}
</style>
