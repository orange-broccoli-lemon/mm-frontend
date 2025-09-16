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

    <!-- 영화 댓글 섹션 -->
    <div class="comments-section">
      <div class="comments-header">
        <h2>영화 리뷰</h2>
        <span class="comments-count">{{ movieComments.length }}개의 리뷰</span>
      </div>
      
      <div v-if="isLoadingComments" class="loading">
        <div class="spinner"></div>
        <p>리뷰를 불러오는 중...</p>
      </div>
      
      <div v-else-if="movieComments.length === 0" class="no-comments">
        <p>아직 등록된 리뷰가 없습니다.</p>
        <p>첫 번째 리뷰를 작성해보세요!</p>
      </div>
      
      <div v-else class="comments-grid">
        <div 
          v-for="comment in movieComments" 
          :key="comment.comment_id" 
          class="comment-item"
        >
          <div class="comment-header">
            <img 
              :src="comment.user_profile_image || spottiImage" 
              :alt="comment.user_name"
              class="user-avatar"
            />
            <div class="user-info">
              <h4>{{ comment.user_name }}</h4>
              <div class="comment-meta">
                <span class="rating">⭐ {{ comment.rating }}/9</span>
                <span class="date">{{ formatDate(comment.create_at || comment.update_at || comment.watched_date || '') }}</span>
              </div>
            </div>
          </div>
          
          <div class="comment-content">
            <p v-if="comment.is_spoiler" class="spoiler-warning">
              ⚠️ 스포일러 포함
            </p>
            <p class="comment-text truncate" :title="comment.content">{{ comment.content }}</p>
          </div>
          
          <div class="comment-footer">
            <div class="comment-stats">
              <span class="likes">❤️ {{ comment.likes_count }}</span>
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
import type { DetailMovie, MovieComment } from "@/stores/movie"
import { useRoute, useRouter } from "vue-router"
import spottiImage from '@/assets/spotti.png'

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const userMovie = useMovieStore()
const movieDetail = ref<DetailMovie | null>(null)
const movieComments = ref<MovieComment[]>([])
const isLoadingComments = ref(false)

onMounted(async () => {
  // 영화 상세 정보 가져오기
  const res = await userMovie.detailMovie(id)
  movieDetail.value = res
  
  // 영화 댓글 가져오기
  await loadMovieComments()
})

// 페이지가 다시 활성화될 때 댓글 새로고침
onActivated(async () => {
  console.log('DetailMovie 페이지 활성화됨, 댓글 새로고침')
  await loadMovieComments()
})

// 쿼리 파라미터 변경 감지하여 댓글 새로고침
watch(() => route.query.refresh, async (newRefresh) => {
  if (newRefresh) {
    console.log('리프레시 쿼리 파라미터 감지됨, 댓글 새로고침')
    await loadMovieComments()
  }
})

// 영화 댓글 로드 함수
const loadMovieComments = async () => {
  isLoadingComments.value = true
  try {
    const comments = await userMovie.fetchMovieComments(id)
    console.log('로드된 댓글 데이터:', comments)
    
    // 댓글 데이터 로드 완료
    console.log(`${comments.length}개의 댓글을 로드했습니다.`)
    
    movieComments.value = comments
  } catch (error) {
    console.error('댓글 로드 실패:', error)
  } finally {
    isLoadingComments.value = false
  }
}

// 날짜 포맷팅 함수
const formatDate = (dateString: string) => {
  if (!dateString || dateString === '' || dateString === 'undefined' || dateString === 'null') {
    return '날짜 없음'
  }
  
  try {
    let date: Date
    
    // ISO 형식인지 확인 (예: 2024-01-15T10:30:00Z)
    if (dateString.includes('T') || dateString.includes('Z')) {
      date = new Date(dateString)
    }
    // YYYY-MM-DD 형식인지 확인
    else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      date = new Date(dateString + 'T00:00:00')
    }
    // 기타 형식
    else {
      date = new Date(dateString)
    }
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      console.warn('유효하지 않은 날짜:', dateString)
      return '날짜 오류'
    }
    
    const formatted = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    
    return formatted
  } catch (error) {
    console.error('날짜 포맷팅 오류:', error, '원본:', dateString)
    return '날짜 오류'
  }
}

const goCreate = () => {
  // 영화 정보를 쿼리 파라미터로 전달
  router.push({ 
    name: "CreateReview", 
    query: { 
      movieId: route.params.id,
      movieTitle: movieDetail.value?.title || '영화',
      poster_url: movieDetail.value?.poster_url || ''
    }
  })
}

const saveMovie = () => {
  console.log("저장 버튼 클릭")
}

const likeMovie = () => {
  console.log("좋아요 버튼 클릭")
}
</script>

<style scoped>
.movie-detail {
  /* display: flex; */
  position: absolute;
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
  border-bottom: 2px solid #f0f0f0;
}

.comments-header h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.comments-count {
  color: #666;
  font-size: 1rem;
  background: #f8f9fa;
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
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
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
  color: #666;
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
  background: #fff;
  border: 1px solid #e0e0e0;
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
  border: 2px solid #f0f0f0;
}

.user-info h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: #666;
}

.rating {
  color: #ffa500;
  font-weight: 500;
}

.date {
  color: #999;
}

/* 댓글 내용 */
.comment-content {
  margin-bottom: 16px;
}

.spoiler-warning {
  background: #fff3cd;
  color: #856404;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-bottom: 12px;
  border-left: 4px solid #ffc107;
}

.comment-text {
  color: #333;
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
  border-top: 1px solid #f0f0f0;
}

.comment-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.likes {
  color: #e74c3c;
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
