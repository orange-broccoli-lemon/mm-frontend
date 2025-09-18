<template>
  <div class="comments-section">
    <div class="comments-header">
      <h2>영화 리뷰</h2>
      <span>{{ comments.length }}개의 리뷰</span>

      <!-- 스포일러 토글 -->
      <div class="ml-4 flex items-center gap-2 text-sm">
        <span class="text-gray-600 dark:text-gray-300"></span>
        <button 
          @click="$emit('toggleSpoilers')"
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            showSpoilers ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          ]"
        >
          <span
            :class="[
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
              showSpoilers ? 'translate-x-6' : 'translate-x-1'
            ]"
          />
        </button>
        <img src="/src/assets/spotti.png" alt="스포띠빠이" class="w-7 h-7 inline-block" />
        <span class="text-gray-500 dark:text-gray-400 text-base font-medium">스포띠빠이</span>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <p>리뷰를 불러오는 중...</p>
    </div>

    <div v-else-if="comments.length === 0" class="no-comments">
      <p>아직 등록된 리뷰가 없습니다.</p>
      <p>첫 번째 리뷰를 작성해보세요!</p>
    </div>

    <div v-else class="comments-grid">
      <div v-for="comment in comments" :key="comment.comment_id" class="comment-item">
        <div class="comment-header">
          <img :src="comment.user_profile_image || defaultImage" :alt="comment.user_name" class="user-avatar" />
          <div class="user-info">
            <h4>{{ comment.user_name }}</h4>
            <div class="comment-meta">
              <span>⭐ {{ (comment.rating / 2).toFixed(1) }}/5</span>
              <span>{{ formatDate(comment.create_at || comment.update_at || comment.watched_date || '') }}</span>
            </div>
          </div>
        </div>

        <div class="comment-content">
          <p v-if="comment.is_spoiler" class="spoiler-warning">
            ⚠️ {{ comment.content }}
          </p>
          <p class="comment-text" :title="comment.content"> {{ comment.content }}</p>
        </div>

        <div class="comment-footer">
          <div class="comment-stats">
            <span class="likes" @click="$emit('commentLikeToggle', comment)">❤️ {{ comment.likes_count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MovieComment } from "@/stores/movie"
import defaultImage from '@/assets/spotti.png'

interface Props {
  comments: MovieComment[]
  showSpoilers: boolean
  isLoading: boolean
}

defineProps<Props>()

defineEmits<{
  toggleSpoilers: []
  commentLikeToggle: [comment: MovieComment]
}>()

// 날짜 포맷팅
const formatDate = (dateString: string) => {
  if (!dateString) return '날짜 없음'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '날짜 오류'
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
/* 댓글 섹션 스타일 */
.comments-section {
  max-width: 1380px;
  margin: 40px auto 0;
  padding: 0 20px 40px;
  background-color: #ffffff;
  color: #111827;
}

.dark .comments-section {
  background-color: #111827;
  color: white;
}

.comments-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
  color: #111827;
}

.dark .comments-header {
  border-bottom: 2px solid #374151;
  color: white;
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
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #111827;
}

.dark .comment-item {
  border: 1px solid #374151;
  background-color: #1f2937;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: white;
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
  flex-shrink: 0;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.spoiler-warning {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-bottom: 12px;
  border-left: 4px solid #3b82f6;
  background-color: #dbeafe;
  color: #1e40af;
}

.dark .spoiler-warning {
  background-color: #1e3a8a;
  color: #93c5fd;
  border-left-color: #60a5fa;
}

.comment-text {
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 4;
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
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
  margin-top: auto;
}

.dark .comment-footer {
  border-top: 1px solid #374151;
}

.comment-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.likes {
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
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
    height: 180px;
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
    height: 160px;
  }
  
  .comment-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}

/* 다크모드 전용 배경색 강제 설정 */
.dark .comments-section {
  background-color: #111827 !important;
}

.dark .comment-item {
  background-color: #1f2937 !important;
}
</style>
