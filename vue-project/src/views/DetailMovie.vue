<template>
  <div v-if="movieDetail" class="movie-detail">
    <!-- 영화 배경 -->
    <div class="movie-hero">
      <img v-if="movieDetail.backdrop_url" :src="movieDetail.backdrop_url" class="backdrop" />
      <div v-else class="backdrop no-image">이미지 없음</div>
    </div>

    <!-- 영화 정보 영역 -->
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

    <!-- 영화 댓글 섹션 -->
    <div class="comments-section">
      <div class="comments-header">
        <h2>영화 리뷰</h2>
        <span>{{ movieComments.length }}개의 리뷰</span>

        <!-- 스포일러 토글 -->
        <label class="ml-4 flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="showSpoilers" @change="loadMovieComments" />
          스포일러 포함 보기
        </label>
      </div>

      <div v-if="isLoadingComments" class="loading">
        <p>리뷰를 불러오는 중...</p>
      </div>

      <div v-else-if="movieComments.length === 0" class="no-comments">
        <p>아직 등록된 리뷰가 없습니다.</p>
        <p>첫 번째 리뷰를 작성해보세요!</p>
      </div>

      <div v-else class="comments-grid">
        <div v-for="comment in movieComments" :key="comment.comment_id" class="comment-item">
          <div class="comment-header">
            <img :src="comment.user_profile_image || spottiImage" :alt="comment.user_name" class="user-avatar" />
            <div class="user-info">
              <h4>{{ comment.user_name }}</h4>
              <div class="comment-meta">
                <span>⭐ {{ comment.rating }}/9</span>
                <span>{{ formatDate(comment.create_at || comment.update_at || comment.watched_date || '') }}</span>
              </div>
            </div>
          </div>

          <div class="comment-content">
          <p v-if="comment.is_spoiler" class="spoiler-warning">
            ⚠️ {{ comment.content }}
          </p>
          <p class="comment-text" :title="comment.content"> {{ comment.content }}</p>
          <!-- ✅ 스포일러여도 항상 내용 보여줌 -->
        </div>

          <div class="comment-footer">
            <div class="comment-stats">
              <span class="likes" @click="commentLikeToggle(comment)">❤️ {{ comment.likes_count }}</span>
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
import { useThreadStore } from "@/stores/thread"
import type { DetailMovie, MovieComment } from "@/stores/movie"
import { useRoute, useRouter } from "vue-router"
import spottiImage from '@/assets/spotti.png'

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
const showSpoilers = ref(false) // ✅ 스포일러 토글 상태

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

// 댓글 로드 함수 (스포일러 포함 여부 반영)
const loadMovieComments = async () => {
  isLoadingComments.value = true
  try {
    const comments = await userMovie.fetchMovieComments(id, showSpoilers.value)
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
  height: 200px; /* 고정 높이 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  margin-bottom: 12px;
  flex-shrink: 0; /* 크기 고정 */
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


/* 댓글 내용 */
.comment-content {
  margin-bottom: 12px;
  flex: 1; /* 남은 공간 활용 */
  display: flex;
  flex-direction: column;
  min-height: 0; /* flexbox overflow를 위해 필요 */
  overflow: hidden;
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
  display: -webkit-box;
  -webkit-line-clamp: 4; /* 4줄로 제한 */
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

/* 댓글 푸터 */
.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid;
  flex-shrink: 0; /* 크기 고정 */
  margin-top: auto; /* 하단에 고정 */
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
    height: 180px; /* 모바일에서 약간 작은 높이 */
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
    height: 160px; /* 작은 화면에서 더 작은 높이 */
  }
  
  .comment-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>