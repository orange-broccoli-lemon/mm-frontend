<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/user'
import CommentCard from '@/components/CommentCard.vue'
import MovieCard from '@/components/MovieCard.vue'
import FollowingModal from '@/components/FollowingModal.vue'
import EditProfileModal from '../components/EditProfileModal.vue'
import spottiImage from '@/assets/spotti.png'

const accountStore = useAccountStore()
const router = useRouter()
const defaultProfileImage = spottiImage
const showAllComments = ref(false)
const showAllLikes = ref(false)
const showAllWatch = ref(false)
const showFollowingModal = ref(false)
const showEditProfileModal = ref(false)

const goFollowing = () => showFollowingModal.value = true
const goToHotMovies = () => router.push('/select-movie')
const goToEditProfile = () => {
  showEditProfileModal.value = true
}

// 영화 상세 페이지 이동
const goToMovieDetail = (movieId: number) => {
  router.push({ name: 'BookDetail', params: { id: movieId } })
}

// 댓글 삭제 처리
const handleCommentDeleted = async (commentId: number) => {
  console.log('댓글 삭제됨:', commentId)
  if (accountStore.user?.user_id) {
    await accountStore.getUserInfo()
    await accountStore.userComment(accountStore.user.user_id)
  }
}

// 프로필 이미지 URL을 절대 경로로 변환
const getProfileImageUrl = () => {
  const profileUrl = accountStore.user?.profile_image_url
  if (!profileUrl) {
    return defaultProfileImage
  }
  
  // 이미 절대 URL인 경우 (http:// 또는 https://로 시작)
  if (profileUrl.startsWith('http://') || profileUrl.startsWith('https://')) {
    return profileUrl
  }
  
  // 상대 경로인 경우 서버 주소 추가
  const baseUrl = 'https://i13m105.p.ssafy.io'
  return `${baseUrl}${profileUrl}`
}

// 프로필 이미지 로딩 성공 처리
const handleProfileImageLoad = () => {
  console.log('프로필 이미지 로딩 성공:', getProfileImageUrl())
}

// 프로필 이미지 로딩 에러 처리
const handleProfileImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.log('프로필 이미지 로딩 실패:', img.src)
  console.log('기본 이미지로 대체:', defaultProfileImage)
  img.src = defaultProfileImage
}

onMounted(async () => {
  console.log('MyPage 마운트됨, 사용자 정보 로드 중...')
  const isValidToken = await accountStore.validateToken()
  if (!isValidToken) {
    console.log('토큰이 유효하지 않습니다. 로그인 페이지로 이동합니다.')
    return
  }
  
  await accountStore.getUserInfo()
  
  // 디버깅: 사용자 정보와 프로필 이미지 확인
  console.log('=== MyPage 디버깅 정보 ===')
  console.log('사용자 정보:', accountStore.user)
  console.log('프로필 이미지 URL:', accountStore.user?.profile_image_url)
  console.log('기본 프로필 이미지:', defaultProfileImage)
  console.log('최종 이미지 소스:', accountStore.user?.profile_image_url || defaultProfileImage)
  console.log('========================')

  if (accountStore.user?.user_id != null) {
    console.log('사용자 ID:', accountStore.user.user_id)
    await accountStore.userComment(accountStore.user.user_id)
    await accountStore.watchList(accountStore.user.user_id)
    await accountStore.likeList(accountStore.user.user_id)
  }
})
</script>

<template>
  <div
    class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 relative"
    v-if="accountStore.user"
  >
    <!-- 헤더 -->
    <div class="bg-gray-50 dark:bg-gray-800 py-8 px-4 animate-fade-in">
      <div class="max-w-4xl mx-auto">
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="relative animate-scale-in">
                <img
                  :src="getProfileImageUrl()"
                  alt="프로필 이미지"
                  class="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                  @error="handleProfileImageError"
                  @load="handleProfileImageLoad"
                />
                <div
                  class="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white"
                  :class="{
                    'bg-green-500': accountStore.user && accountStore.token,
                    'bg-gray-400': !accountStore.user || !accountStore.token
                  }"
                ></div>
              </div>
              <div class="animate-slide-in-right">
                <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {{ accountStore.user.name }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400">영화 리뷰어</p>
              </div>
            </div>
            
            <!-- 회원정보 수정 아이콘 -->
            <button
              @click="goToEditProfile"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              title="회원정보 수정"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </button>
          </div>

          <!-- 유저 성향 -->
       <div
            class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 
                  text-gray-700 dark:text-gray-300 animate-slide-up"
          >
            <span class="font-bold">| 유저 성향</span>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              {{ accountStore.user.profile_review || '아직 설정되지 않았습니다.' }}
            </p>
      </div>
        </div>
      </div>
    </div>

    <!-- 통계 카드 -->
    <div class="py-6 px-4 animate-slide-up">
      <div class="max-w-4xl mx-auto grid grid-cols-3 gap-4">
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center animate-fade-in-delayed"
        >
          <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ accountStore.user.comments_count || 0 }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">리뷰</div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 animate-fade-in-delayed-2"
          @click="goFollowing"
        >
          <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ accountStore.user.followers_count || 0 }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">팔로워</div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 animate-fade-in-delayed-3"
          @click="goFollowing"
        >
          <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {{ accountStore.user.following_count || 0 }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">팔로잉</div>
        </div>
      </div>
    </div>

    <!-- 리뷰 -->
    <div class="py-6 px-4 animate-slide-up-delayed">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            리뷰 {{ accountStore.user.comments_count || 0 }}개
          </h2>
          <button
            class="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
            @click="showAllComments = !showAllComments"
          >
            {{ showAllComments ? '접기' : '더보기' }}
          </button>
        </div>

        <div v-if="(accountStore.commentList ?? []).length">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CommentCard
              v-for="comment in (showAllComments ? accountStore.commentList ?? [] : (accountStore.commentList ?? []).slice(0, 4))"
              :key="comment.comment_id"
              :comment_id="comment.comment_id"
              :profileImage="getProfileImageUrl()"
              :content="comment.content"
              :name="accountStore.user?.name || '이름 없음'"
              :movietitle="comment.movie_title"
              :movie_poster_url="comment.movie_poster_url"
              :movie_id="comment.movie_id"
              :rating="Number(comment.rating) || 0"
              @deleted="handleCommentDeleted"
            />
          </div>
        </div>
        <div
          v-else
          class="text-center py-12 text-gray-600 dark:text-gray-400"
        >
          <div class="text-4xl mb-4">📝</div>
          <h3
            class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2"
          >
            아직 작성한 리뷰가 없어요
          </h3>
          <p>첫 번째 영화 리뷰를 작성해보세요!</p>
        </div>
      </div>
    </div>

    <!-- 좋아요한 영화 -->
    <div class="py-6 px-4 animate-slide-up-delayed-2">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            좋아요한 영화 {{ (accountStore.like_list ?? []).length }}개
          </h2>
          <button
            class="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
            @click="showAllLikes = !showAllLikes"
          >
            {{ showAllLikes ? '접기' : '더보기' }}
          </button>
        </div>

        <div v-if="(accountStore.like_list ?? []).length">
          <div class="grid grid-cols-4 gap-4">
            <MovieCard
              v-for="movie in showAllLikes ? accountStore.like_list : (accountStore.like_list ?? []).slice(0,4)"
              :key="movie.movie_id"
              :image="movie.poster_url || '/no-image.png'"
              :title="movie.title"
              @click="goToMovieDetail(movie.movie_id)"
            />
          </div>
        </div>
        <div
          v-else
          class="text-center py-8 text-gray-600 dark:text-gray-400"
        >
          좋아요한 영화가 없어요
        </div>
      </div>
    </div>

    <!-- 저장한 영화 -->
    <div class="py-6 px-4 animate-slide-up-delayed-3">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            저장한 영화 {{ (accountStore.watch_list ?? []).length }}개
          </h2>
          <button
            class="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
            @click="showAllWatch = !showAllWatch"
          >
            {{ showAllWatch ? '접기' : '더보기' }}
          </button>
        </div>

        <div v-if="(accountStore.watch_list ?? []).length">
          <div class="grid grid-cols-4 gap-4">
            <MovieCard
              v-for="movie in showAllWatch ? accountStore.watch_list : (accountStore.watch_list ?? []).slice(0,4)"
              :key="movie.movie_id"
              :image="movie.poster_url || '/no-image.png'"
              :title="movie.title"
              @click="goToMovieDetail(movie.movie_id)"
            />
          </div>
        </div>
        <div
          v-else
          class="text-center py-8 text-gray-600 dark:text-gray-400"
        >
          저장한 영화가 없어요
        </div>
      </div>
    </div>

    <!-- 팔로워/팔로잉 모달 -->
    <FollowingModal
      :is-open="showFollowingModal"
      @close="showFollowingModal = false"
    />

    <!-- 프로필 수정 모달 -->
    <EditProfileModal
      :is-open="showEditProfileModal"
      @close="showEditProfileModal = false"
    />
  </div>
</template>

<style scoped>
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
  animation: fadeInDelayed 0.6s ease-out 0.8s both;
}

.animate-fade-in-delayed-2 {
  animation: fadeInDelayed 0.6s ease-out 1.0s both;
}

.animate-fade-in-delayed-3 {
  animation: fadeInDelayed 0.6s ease-out 1.2s both;
}

.animate-slide-up-delayed {
  animation: slideUp 0.8s ease-out 1.0s both;
}

.animate-slide-up-delayed-2 {
  animation: slideUp 0.8s ease-out 1.2s both;
}

.animate-slide-up-delayed-3 {
  animation: slideUp 0.8s ease-out 1.4s both;
}
</style>
