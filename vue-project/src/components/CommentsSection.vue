<template>
  <div class="comments-section">
    <div class="comments-header">
      <h2>영화 리뷰</h2>
      <span>{{ comments.length }}개의 리뷰</span>

      <!-- 스포일러 토글 -->
      <div class="ml-4 flex items-center gap-2 text-sm">
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

    <!-- 로딩 -->
    <div v-if="isLoading" class="loading">
      <p>리뷰를 불러오는 중...</p>
    </div>

    <!-- 댓글 없음 -->
    <div v-else-if="comments.length === 0" class="no-comments">
      <p>아직 등록된 리뷰가 없습니다.</p>
      <p>첫 번째 리뷰를 작성해보세요!</p>
    </div>

    <!-- 댓글 리스트 -->
    <div v-else class="comments-grid">
      <div
        v-for="comment in comments"
        :key="comment.comment_id"
        class="comment-item"
      >
        <!-- 헤더 -->
        <div class="comment-header">
          <img :src="getProfileImageUrl(comment.user_profile_image)" :alt="comment.user_name" class="user-avatar" />
          <div class="user-info">
            <h4>{{ comment.user_name }}</h4>
            <div class="comment-meta">
              <span>⭐ {{ (comment.rating / 2).toFixed(1) }}/5</span>
              <span>{{ formatDate(comment.create_at || comment.update_at || comment.watched_date || '') }}</span>
            </div>
          </div>
        </div>

        <!-- 내용 -->
        <div class="comment-content">
         <p
          class="comment-text clamped"
          :class="{
            expanded: expandedComments.includes(comment.comment_id),
            spoiler: comment.is_spoiler
          }"
          :title="comment.content"
          :ref="(el: any) => setContentRef(comment.comment_id, el)"
        >
          <template v-if="comment.is_spoiler">
            ⚠️ {{ comment.content }}
          </template>
          <template v-else>
            {{ comment.content }}
          </template>
        </p>
        </div>

        <!-- 푸터 -->
        <div class="comment-footer">
          <span 
            class="likes" 
            :class="{ 'liked': comment.is_liked }"
            @click="$emit('commentLikeToggle', comment)"
          >
            👍 {{ comment.likes_count }}
          </span>

          <button
            v-if="needsMoreMap[comment.comment_id]"
            @click="toggleExpand(comment.comment_id)"
            class="more-btn"
          >
            {{ expandedComments.includes(comment.comment_id) ? '접기' : '더보기' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUpdated, nextTick, onUnmounted, watch } from 'vue'
import type { MovieComment } from '@/stores/movie'
import defaultImage from '@/assets/spotti.png'

/** Props / Emits */
const props = defineProps<{
  comments: MovieComment[]
  showSpoilers: boolean
  isLoading: boolean
}>()

defineEmits<{
  toggleSpoilers: []
  commentLikeToggle: [comment: MovieComment]
}>()

/** 펼침 상태 */
const expandedComments = ref<number[]>([])

/** ref 저장소 (id -> HTMLElement) */
const contentRefMap = ref<Record<number, HTMLElement>>({})

/** ref 설정 함수 */
const setContentRef = (id: number, el: any) => {
  if (el instanceof HTMLElement) {
    contentRefMap.value[id] = el
  } else {
    delete contentRefMap.value[id]
  }
}

/** 1줄 초과 여부 */
const needsMoreMap = ref<Record<number, boolean>>({})

/** 더보기/접기 토글 */
const toggleExpand = (id: number) => {
  if (expandedComments.value.includes(id)) {
    expandedComments.value = expandedComments.value.filter(c => c !== id)
  } else {
    expandedComments.value.push(id)
  }
}

/** 이미지 경로 */
const getProfileImageUrl = (url?: string) => {
  if (!url) return defaultImage
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://i13m105.p.ssafy.io${url}`
}

/** 날짜 포맷 */
const formatDate = (dateString: string) => {
  if (!dateString) return '날짜 없음'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '날짜 오류'
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** 1줄 초과 체크 */
const measureAll = () => {
  const next: Record<number, boolean> = {}
  Object.entries(contentRefMap.value).forEach(([idStr, el]) => {
    const id = Number(idStr)
    const computed = getComputedStyle(el)
    const lineHeight = parseFloat(computed.lineHeight) || 20
    const oneLine = lineHeight

    // clamp 해제하고 전체 높이 확인
    const prevDisplay = el.style.display
    const prevClamp = (el.style as any).webkitLineClamp
    const prevOverflow = el.style.overflow

    el.style.display = 'block'
    ;(el.style as any).webkitLineClamp = 'unset'
    el.style.overflow = 'visible'

    const fullHeight = el.scrollHeight

    // 원복
    el.style.display = prevDisplay
    ;(el.style as any).webkitLineClamp = prevClamp
    el.style.overflow = prevOverflow

    next[id] = fullHeight > oneLine + 1
  })
  needsMoreMap.value = next
}

/** 디바운스 */
const debounced = (fn: () => void, wait = 120) => {
  let t: number | undefined
  return () => {
    if (t) window.clearTimeout(t)
    t = window.setTimeout(fn, wait)
  }
}
const measureAllDebounced = debounced(() => measureAll())

/** 라이프사이클 */
onMounted(async () => {
  await nextTick()
  measureAll()
  window.addEventListener('resize', measureAllDebounced)
})
onUpdated(() => measureAllDebounced())
onUnmounted(() => window.removeEventListener('resize', measureAllDebounced))

watch(() => props.comments, async () => {
  await nextTick()
  measureAll()
}, { deep: true })
</script>

<style scoped>
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
  border-bottom: 2px solid #e5e7eb;
}

.loading, .no-comments {
  text-align: center;
  padding: 60px 20px;
}

/* 🔥 Masonry 레이아웃 */
.comments-grid {
  column-count: 3;     /* 기본 3열 */
  column-gap: 20px;    /* 열 간격 */
  margin-top: 20px;
}

.comment-item {
  display: inline-block;     /* column 안에서 블록처럼 */
  width: 100%;
  margin-bottom: 20px;       /* 카드 사이 간격 */
  break-inside: avoid;       /* 카드가 쪼개져서 다른 열로 넘어가지 않도록 */
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-meta {
  display: flex;
  gap: 12px;
  font-size: 0.85rem;
  color: #6b7280;
}

.comment-content {
  padding-right: 4px;
}

.comment-text {
  line-height: 1.6;
  font-size: 0.95rem;
}

/* 기본 1줄 표시 */
.comment-text.clamped {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 펼친 경우 전체 표시 */
.comment-text.expanded {
  -webkit-line-clamp: unset;
  line-clamp: unset;
  display: block;
}

/* 스포일러 스타일 */
.comment-text.spoiler {
  /* padding: 8px 12px; */
  border-left: 4px solid #3b82f6;
  background-color: #dbeafe;
  color: #1e40af;
  border-radius: 6px;
}

.comment-footer {
  display: flex;
  justify-content: space-between; /* 👍 왼쪽: 좋아요, 오른쪽: 더보기 */
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
  margin-top: 10px;
}

.likes {
  font-size: 0.9rem;
  cursor: pointer;
}

.more-btn {
  font-size: 0.85rem;
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
}
.more-btn:hover {
  text-decoration: underline;
}

/* 🔥 반응형: 열 개수 줄이기 */
@media (max-width: 1024px) {
  .comments-grid {
    column-count: 2;
  }
}
@media (max-width: 640px) {
  .comments-grid {
    column-count: 1;
  }
}


</style>
