<template>
  <div class="comments-section">
    <div class="comments-header">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 tracking-tight">
        영화 리뷰 <span class="text-blue-600 dark:text-blue-400">{{ comments.length }}</span>개
      </h2>
      <span></span>

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
        <div class="relative group">
          <img src="/src/assets/spotti.png" alt="스포띠빠이" class="w-7 h-7 inline-block cursor-pointer" />
          <span class="text-gray-500 dark:text-gray-400 text-base font-medium">스포띠빠이</span>
          
          <!-- 툴팁 -->
          <div class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg shadow-lg dark:shadow-gray-800 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
               :class="{
                 'opacity-0 group-hover:opacity-100': !showTip,
                 'opacity-100': showTip && tipVisible,
                 'opacity-0': showTip && !tipVisible
               }">
            스포띠빠이가 리뷰를 숨기고 있을지도 몰라요
            <!-- 툴팁 화살표 -->
            <div class="absolute top-full right-4 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
          </div>
        </div>
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
<<<<<<< HEAD
        class="comment-item transition-all duration-300 ease-in-out hover-expandable bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-sm dark:shadow-gray-900 hover:shadow-lg dark:hover:shadow-gray-800"
=======
        class="comment-item"
>>>>>>> 2a42c6072eb5bda5d06263399eba7568f55c819b
      >
        <!-- 헤더 -->
        <div class="comment-header">
          <img :src="getProfileImageUrl(comment.user_profile_image)" :alt="comment.user_name" class="user-avatar" />
          <div class="user-info">
            <h4 class="text-gray-900 dark:text-gray-100">{{ comment.user_name }}</h4>
            <div class="comment-meta">
              <span class="text-gray-600 dark:text-gray-400">⭐ {{ (comment.rating / 2).toFixed(1) }}/5</span>
              <span class="text-gray-500 dark:text-gray-500">{{ formatDate(comment.create_at || comment.update_at || comment.watched_date || '') }}</span>
            </div>
          </div>
        </div>

        <!-- 내용 -->
        <div class="comment-content">
         <p
<<<<<<< HEAD
          class="comment-text transition-all duration-300 ease-in-out text-gray-800 dark:text-gray-200"
          :class="{
            'line-clamp-1': !expandedComments.includes(comment.comment_id),
            'line-clamp-none': expandedComments.includes(comment.comment_id),
=======
          class="comment-text clamped"
          :class="{
            expanded: expandedComments.includes(comment.comment_id),
>>>>>>> 2a42c6072eb5bda5d06263399eba7568f55c819b
            spoiler: comment.is_spoiler
          }"
          :title="comment.content"
          :ref="(el: any) => setContentRef(comment.comment_id, el)"
<<<<<<< HEAD
         >
           {{ comment.content }}
         </p>
        </div>

        <!-- 푸터 -->
        <div class="comment-footer border-gray-200 dark:border-gray-600">
          <span 
            class="likes text-gray-700 dark:text-gray-300"
            :class="{ 
              liked: comment.is_liked
            }"
            @click="$emit('commentLikeToggle', comment)"
          >
            <span class="like-icon">👍</span>
            <span class="like-count">{{ comment.likes_count }}</span>
          </span>
=======
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
>>>>>>> 2a42c6072eb5bda5d06263399eba7568f55c819b
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

<<<<<<< HEAD
/** 펼침 상태 (호버용) */
const expandedComments = ref<number[]>([])

/** 팁 표시 상태 */
const showTip = ref(false)
const tipVisible = ref(false)

=======
/** 펼침 상태 */
const expandedComments = ref<number[]>([])

>>>>>>> 2a42c6072eb5bda5d06263399eba7568f55c819b
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

<<<<<<< HEAD
=======
/** 더보기/접기 토글 */
const toggleExpand = (id: number) => {
  if (expandedComments.value.includes(id)) {
    expandedComments.value = expandedComments.value.filter(c => c !== id)
  } else {
    expandedComments.value.push(id)
  }
}

>>>>>>> 2a42c6072eb5bda5d06263399eba7568f55c819b
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

<<<<<<< HEAD
/** 팁 표시 함수 */
const showWelcomeTip = () => {
  setTimeout(() => {
    showTip.value = true
    nextTick(() => {
      tipVisible.value = true
      setTimeout(() => {
        tipVisible.value = false
        setTimeout(() => {
          showTip.value = false
        }, 300)
      }, 3000)
    })
  }, 1000)
}

=======
>>>>>>> 2a42c6072eb5bda5d06263399eba7568f55c819b
/** 라이프사이클 */
onMounted(async () => {
  await nextTick()
  measureAll()
  window.addEventListener('resize', measureAllDebounced)
<<<<<<< HEAD
  showWelcomeTip()
=======
>>>>>>> 2a42c6072eb5bda5d06263399eba7568f55c819b
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

<<<<<<< HEAD
.comments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
=======
/* 🔥 Masonry 레이아웃 */
.comments-grid {
  column-count: 3;     /* 기본 3열 */
  column-gap: 20px;    /* 열 간격 */
>>>>>>> 2a42c6072eb5bda5d06263399eba7568f55c819b
  margin-top: 20px;
  align-items: start;
  position: relative;
  grid-auto-rows: min-content;
}

.comment-item {
<<<<<<< HEAD
  border: 1px solid;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  min-height: fit-content;
  position: relative;
  z-index: 1;
  contain: layout;
  cursor: pointer;
}

.hover-expandable:hover {
  z-index: 5;
  transform: translateY(-2px);
}

.hover-expandable:hover .comment-text {
  line-clamp: none !important;
  -webkit-line-clamp: none !important;
  display: block !important;
}

=======
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

>>>>>>> 2a42c6072eb5bda5d06263399eba7568f55c819b
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
<<<<<<< HEAD
}

/* 스포일러 */
.comment-text.spoiler {
  position: relative;
  padding-left: 12px;
  border-left: 3px solid #8b5cf6;
  color: #8b5cf6;
  font-weight: 500;
}
.comment-text.spoiler::before {
  content: "⚠️";
  margin-right: 8px;
  font-size: 1rem;
}
@media (prefers-color-scheme: dark) {
  .comment-text.spoiler {
    border-left: 3px solid #a78bfa;
    color: #a78bfa;
  }
=======
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
>>>>>>> 2a42c6072eb5bda5d06263399eba7568f55c819b
}

.comment-footer {
  display: flex;
  justify-content: space-between; /* 👍 왼쪽: 좋아요, 오른쪽: 더보기 */
  align-items: center;
  padding-top: 10px;
<<<<<<< HEAD
  border-top: 1px solid;
=======
  border-top: 1px solid #e5e7eb;
>>>>>>> 2a42c6072eb5bda5d06263399eba7568f55c819b
  margin-top: 10px;
}

/* 👍 좋아요 버튼 */
.likes {
<<<<<<< HEAD
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.2s ease-in-out;
  user-select: none;
  background: transparent; /* 기본 배경 없음 */
}

.likes:hover {
  transform: translateY(-1px);
}

/* 눌렀을 때만 배경 */
.likes.liked {
  background-color: #dbeafe; /* light 모드 - 하늘색 */
  color: #1e40af;
}

.dark .likes.liked {
  background-color: #4b5563; /* dark 모드 */
  color: #f9fafb;
}

.like-icon {
  transition: transform 0.2s ease-in-out;
}

.likes:hover .like-icon {
  transform: scale(1.1);
}

.likes.liked .like-icon {
  animation: heartBeat 0.6s ease-in-out;
}

.likes.liked {
  animation: pulseGlow 0.3s ease-in-out;
}

.likes:active {
  transform: translateY(1px) scale(0.98);
}

.likes:active .like-icon {
  transform: scale(0.9);
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1.1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1.2); }
  75% { transform: scale(1.25); }
}

@keyframes pulseGlow {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

/* 반응형 */
@media (max-width: 1024px) {
  .comments-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}
@media (max-width: 640px) {
  .comments-grid {
    grid-template-columns: 1fr;
  }
}
=======
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


>>>>>>> 2a42c6072eb5bda5d06263399eba7568f55c819b
</style>
