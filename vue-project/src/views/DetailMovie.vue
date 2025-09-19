<template>
  <div v-if="movieDetail" class="movie-detail min-h-screen bg-white dark:bg-gray-900">
    <!-- 영화 배경 -->
    <div class="movie-hero animate-fade-in">
      <img v-if="movieDetail.backdrop_url" :src="movieDetail.backdrop_url" class="backdrop" />
      <div v-else class="backdrop no-image">이미지 없음</div>
    </div>

    <!-- 영화 정보 영역 -->
    <div class="movie-bottom animate-slide-up">
      <div class="movie-poster animate-scale-in">
        <img v-if="movieDetail.poster_url" :src="movieDetail.poster_url" class="poster" />
        <div v-else class="poster no-image">이미지 없음</div>
        <span>평점 </span>
        <span>{{ movieDetail.average_rating }}</span>
       
      </div>
      
      <!-- 코멘트 요약 -->


      <div class="movie-content1 animate-slide-in-right">
        <div class="header">
          <h1>{{ movieDetail.title }}</h1>
          <div class="actions">
            <button :class="['like', isLike ? 'active' : '']" @click="toggleLike">
              {{ isLike ? '좋아요 취소' : '좋아요' }}
            </button>
            <button :class="['save', isWatch ? 'active' : '']" @click="toggleWatch">
              {{ isWatch ? '저장 취소' : '저장' }}
            </button>
            <button class="comment" @click="goCreate">코멘트</button>
          </div>
        </div>
        <hr />
        <p>{{ movieDetail.overview || "줄거리가 아직 등록되지 않았습니다." }}</p>
      </div>
    </div>

    <div
  v-if="movieDetail.concise_review"
  class="max-w-6xl mx-auto mt-10 px-4 animate-slide-up"
>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
  >
    <span class="font-bold text-gray-900 dark:text-gray-100">| AI코멘트 요약</span>
    <p class="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
      {{ movieDetail.concise_review }}
    </p>
  </div>
</div>

    <!-- 영화 댓글 섹션 -->
    <div class="animate-fade-in-delayed">
      <CommentsSection
        :comments="movieComments"
        :show-spoilers="showSpoilers"
        :is-loading="isLoadingComments"
        @toggle-spoilers="toggleSpoilers"
        @comment-like-toggle="commentLikeToggle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, watch } from "vue"
import { useMovieStore } from "@/stores/movie"
import { useAccountStore } from "@/stores/user"
import { useThreadStore } from "@/stores/thread"
import type { DetailMovie, MovieComment } from "@/stores/movie"
import { useRoute, useRouter } from "vue-router"
import CommentsSection from '@/components/CommentsSection.vue'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const userMovie = useMovieStore()
const useUser = useAccountStore()
const useThread = useThreadStore()

const movieDetail = ref<DetailMovie | null>(null)
const movieComments = ref<MovieComment[]>([])
const isLoadingComments = ref(false)

const isLike = ref(false)
const isWatch = ref(false)
const showSpoilers = ref(true) // ✅ 스포일러 토글 상태

// 영화 정보와 댓글 불러오기
onMounted(async () => {
  const res = await userMovie.detailMovie(id)
  if (res) {
    movieDetail.value = res
    isLike.value = res.is_liked ?? false
    isWatch.value = res.is_in_watchlist ?? false
  }
  await loadMovieComments()
})

// 페이지 활성화 시 댓글 새로고침
onActivated(async () => await loadMovieComments())

watch(() => route.query.refresh, async (newRefresh) => {
  if (newRefresh) await loadMovieComments()
})

// 좋아요 토글
const toggleLike = async () => {
  if (!useUser.token) {
    alert('로그인이 필요합니다.')
    return
  }
  try {
    if (isLike.value) {
      await useUser.unlikeMovie(id)
      isLike.value = false
    } else {
      await useUser.addLikeMovie(id)
      isLike.value = true
    }
  } catch {
    alert('좋아요 처리 실패!')
  }
}

// 저장 토글
const toggleWatch = async () => {
  if (!useUser.token) {
    alert('로그인이 필요합니다.')
    return
  }
  try {
    if (isWatch.value) {
      await useUser.unWatchMovie(id)
      isWatch.value = false
    } else {
      await useUser.addWatchList(id)
      isWatch.value = true
    }
  } catch {
    alert('저장 처리 실패!')
  }
}

// 스포일러 토글 함수
const toggleSpoilers = () => {
  showSpoilers.value = !showSpoilers.value
  loadMovieComments()
}

// 댓글 로드 함수 (스포일러 포함 여부 반영)
const loadMovieComments = async () => {
  isLoadingComments.value = true
  try {
    const comments = await userMovie.fetchMovieComments(id, !showSpoilers.value)
    movieComments.value = comments
  } catch (error) {
    console.error('댓글 로드 실패:', error)
  } finally {
    isLoadingComments.value = false
  }
}

const commentLikeToggle = async (comment: MovieComment) => {
  if (!useUser.token) {
    alert('로그인이 필요합니다.')
    return
  }
  try {
    if (comment.is_liked) {
      await useThread.unLikeComment(comment.comment_id)
      comment.is_liked = false
      comment.likes_count = Math.max(comment.likes_count - 1, 0)
    } else {
      const updatedComment = await useThread.likeComment(comment.comment_id)
      comment.is_liked = true
      comment.likes_count = updatedComment?.likes_count ?? comment.likes_count + 1
    }
  } catch (error) {
    console.error('댓글 좋아요 토글 실패', error)
    alert('좋아요 처리 실패!')
  }
}


// 댓글 작성 페이지 이동
const goCreate = () => {
  router.push({ 
    name: "create-review", 
    query: { 
      movieId: route.params.id,
      movieTitle: movieDetail.value?.title || '영화',
      poster_url: movieDetail.value?.poster_url || ''
    }
  })
}
</script>


<style scoped>
.movie-detail {
  position: relative;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
  font-family: "Noto Sans KR", sans-serif;
  background-color: #ffffff; /* white */
}

.dark .movie-detail {
  background-color: #111827; /* gray-900 */
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
  color: #374151;
}

.dark .movie-poster {
  color: #d1d5db;
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
  padding: 24px;
  border-radius: 12px;
}

.movie-content1 {
  flex: 1;
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
  color: #111827;
}

.dark .header h1 {
  color: #f9fafb;
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

.actions .like {
  background: #e5e7eb;
  color: #374151;
  border: 1px solid #d1d5db;
}

.actions .like:hover {
  background: #d1d5db;
}

.actions .like.active {
  background: #ef4444;
  color: #fff;
  border-color: #dc2626;
}

.actions .like.active:hover {
  background: #dc2626;
}

.dark .actions .like {
  background: #374151;
  color: #d1d5db;
  border-color: #4b5563;
}

.dark .actions .like:hover {
  background: #4b5563;
}

.dark .actions .like.active {
  background: #ef4444;
  color: #fff;
  border-color: #dc2626;
}

.dark .actions .like.active:hover {
  background: #dc2626;
}

.actions .save {
  background: #ff8e3d;
  color: #fff;
}

.actions .save:hover {
  background: #ffa12e;
}

.actions .save.active {
  background: #059669;
  color: #fff;
}

.actions .save.active:hover {
  background: #047857;
}

.dark .actions .save {
  background: #ff8e3d;
  color: #fff;
}

.dark .actions .save:hover {
  background: #ffa12e;
}

.dark .actions .save.active {
  background: #059669;
  color: #fff;
}

.dark .actions .save.active:hover {
  background: #047857;
}

.actions .comment {
  background: #3b82f6;
  color: #fff;
  border: 1px solid #2563eb;
}

.actions .comment:hover {
  background: #2563eb;
}

.dark .actions .comment {
  background: #3b82f6;
  color: #fff;
  border-color: #2563eb;
}

.dark .actions .comment:hover {
  background: #2563eb;
}

.movie-content p {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
}

.dark .movie-content p {
  color: #d1d5db;
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
  font-size: 1.5rem;
  font-weight: bold;
}

/* 다크모드 전용 배경색 강제 설정 */
.dark .movie-detail {
  background-color: #111827 !important; /* gray-900 */
}

/* 다크모드에서 전체 페이지 배경색 일관성 보장 */
.dark .movie-detail::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #111827; /* gray-900 */
  z-index: -1;
  pointer-events: none;
}

/* 화이트모드에서 전체 페이지 배경색 일관성 보장 */
.movie-detail::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff; /* white */
  z-index: -1;
  pointer-events: none;
}

/* 애니메이션 효과 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInDelayed {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 애니메이션 클래스 */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out 0.2s both;
}

.animate-scale-in {
  animation: scaleIn 0.6s ease-out 0.4s both;
}

.animate-slide-in-right {
  animation: slideInRight 0.8s ease-out 0.6s both;
}

.animate-fade-in-delayed {
  animation: fadeInDelayed 0.8s ease-out 0.8s both;
}
</style>