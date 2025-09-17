<template>
  <div v-if="movieDetail" class="movie-detail bg-white dark:bg-gray-900 transition-colors duration-300">
    <!-- 영화 배경 -->
    <div class="movie-hero">
      <img
        v-if="movieDetail.backdrop_url"
        :src="movieDetail.backdrop_url"
        class="backdrop"
      />
      <div v-else class="backdrop no-image bg-gray-600 dark:bg-gray-700 text-white">
        이미지 없음
      </div>
    </div>

    <!-- 영화 정보 영역 -->
    <div class="movie-bottom">
      <div class="movie-poster">
        <img v-if="movieDetail.poster_url" :src="movieDetail.poster_url" class="poster" />
        <div v-else class="poster no-image bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">이미지 없음</div>
        <span class="text-gray-700 dark:text-gray-300">평점 </span>
        <span class="text-gray-900 dark:text-white font-semibold">{{ movieDetail.average_rating }}</span>
      </div>

      <div class="movie-content1 bg-white/90 dark:bg-gray-800/90">
        <div class="header">
          <h1 class="text-gray-900 dark:text-white">{{ movieDetail.title }}</h1>
          <div class="actions">
            <button
              :class="['like', isLike ? 'bg-red-200 dark:bg-red-700 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300']"
              @click="toggleLike"
            >
              {{ isLike ? '좋아요 취소' : '좋아요' }}
            </button>
            <button
              :class="['save', isWatch ? 'bg-orange-400 text-white' : 'bg-orange-300 text-white']"
              @click="toggleWatch"
            >
              {{ isWatch ? '저장 취소' : '저장' }}
            </button>
            <button class="comment bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" @click="goCreate">코멘트</button>
          </div>
        </div>
        <hr class="border-gray-200 dark:border-gray-600">
        <p class="text-gray-600 dark:text-gray-300">{{ movieDetail.overview || "줄거리가 아직 등록되지 않았습니다." }}</p>
      </div>
    </div>

    <!-- 영화 댓글 섹션 -->
    <div class="comments-section">
      <div class="comments-header border-gray-200 dark:border-gray-600">
        <h2 class="text-gray-900 dark:text-white">영화 리뷰</h2>
        <span class="comments-count bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{{ movieComments.length }}개의 리뷰</span>
      </div>

      <div v-if="isLoadingComments" class="loading text-gray-600 dark:text-gray-400">
        <div class="spinner border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400"></div>
        <p>리뷰를 불러오는 중...</p>
      </div>

      <div v-else-if="movieComments.length === 0" class="no-comments text-gray-600 dark:text-gray-400">
        <p>아직 등록된 리뷰가 없습니다.</p>
        <p>첫 번째 리뷰를 작성해보세요!</p>
      </div>

      <div v-else class="comments-grid">
        <div 
          v-for="comment in movieComments" 
          :key="comment.comment_id" 
          class="comment-item bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
        >
          <div class="comment-header">
            <img 
              :src="comment.user_profile_image || spottiImage" 
              :alt="comment.user_name"
              class="user-avatar border-gray-200 dark:border-gray-600"
            />
            <div class="user-info">
              <h4 class="text-gray-900 dark:text-white">{{ comment.user_name }}</h4>
              <div class="comment-meta text-gray-600 dark:text-gray-400">
                <span class="rating text-orange-500 dark:text-orange-400">⭐ {{ comment.rating }}/9</span>
                <span class="date text-gray-500 dark:text-gray-500">{{ formatDate(comment.create_at || comment.update_at || comment.watched_date || '') }}</span>
              </div>
            </div>
          </div>

          <div class="comment-content">
            <p v-if="comment.is_spoiler" class="spoiler-warning bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600">
              ⚠️ 스포일러 포함
            </p>
            <p class="comment-text text-gray-700 dark:text-gray-300" :title="comment.content">{{ comment.content }}</p>
          </div>

          <div class="comment-footer border-gray-200 dark:border-gray-600">
            <div class="comment-stats">
              <span class="likes text-red-500 dark:text-red-400">❤️ {{ comment.likes_count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, watch } from "vue"
import { useMovieStore } from "@/stores/movie"
import { useAccountStore } from "@/stores/user"
import type { DetailMovie, MovieComment } from "@/stores/movie"
import { useRoute, useRouter } from "vue-router"
import spottiImage from '@/assets/spotti.png'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const userMovie = useMovieStore()
const useUser = useAccountStore()

const movieDetail = ref<DetailMovie | null>(null)
const movieComments = ref<MovieComment[]>([])
const isLoadingComments = ref(false)

const isLike = ref(false)
const isWatch = ref(false)

// 영화 정보와 댓글 불러오기
onMounted(async () => {
 const res = await userMovie.detailMovie(id)
if (res) {
  console.log("확인합시다", res)
  movieDetail.value = res
  isLike.value = res.is_liked ?? false
  isWatch.value = res.is_in_watchlist ?? false
} else {
  console.warn('영화 상세 정보가 없습니다.')
  movieDetail.value = null
  isLike.value = false
  isWatch.value = false
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

// 댓글 로드 함수
const loadMovieComments = async () => {
  isLoadingComments.value = true
  try {
    const comments = await userMovie.fetchMovieComments(id)
    movieComments.value = comments
  } catch (error) {
    console.error('댓글 로드 실패:', error)
  } finally {
    isLoadingComments.value = false
  }
}

// 날짜 포맷팅
const formatDate = (dateString: string) => {
  if (!dateString) return '날짜 없음'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '날짜 오류'
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })
}

// 댓글 작성 페이지 이동
const goCreate = () => {
  router.push({ 
    name: "CreateReview", 
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
  /* display: flex; */
  position: absolute;
  width: 100%;
  flex-direction: column;
  font-family: "Noto Sans KR", sans-serif;
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
  border: none;
}

.movie-content p {
  font-size: 1rem;
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
  font-size: 1.5rem;
  font-weight: bold;
}

/* 댓글 섹션 스타일 */
.comments-section {
  max-width: 1380px;
  margin: 40px auto 0;
  padding: 0 20px 40px;
}

.comments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid;
}

.comments-header h2 {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
}

.comments-count {
  font-size: 1rem;
  padding: 6px 12px;
  border-radius: 20px;
}

/* 로딩 스타일 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid;
  border-top: 4px solid;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 댓글 없음 스타일 */
.no-comments {
  text-align: center;
  padding: 60px 20px;
}

.no-comments p {
  margin: 8px 0;
  font-size: 1.1rem;
}

/* 댓글 그리드 */
.comments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* 댓글 아이템 */
.comment-item {
  border: 1px solid;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.comment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 댓글 헤더 */
.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid;
}

.user-info h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
}

.rating {
  font-weight: 500;
}

.date {
}

/* 댓글 내용 */
.comment-content {
  margin-bottom: 16px;
}

.spoiler-warning {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-bottom: 12px;
  border-left: 4px solid;
}

.comment-text {
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

/* 댓글 푸터 */
.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid;
}

.comment-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.likes {
  font-size: 0.9rem;
  font-weight: 500;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .comments-section {
    padding: 0 16px 40px;
  }
  
  .comments-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .comments-header h2 {
    font-size: 1.5rem;
  }
  
  .comments-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .comment-item {
    padding: 16px;
  }
  
  .comment-header {
    gap: 10px;
  }
  
  .user-avatar {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .comments-section {
    padding: 0 12px 40px;
  }
  
  .comment-item {
    padding: 12px;
  }
  
  .comment-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>