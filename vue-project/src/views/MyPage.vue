<template>
  <div class="mypage-container" v-if="accountStore.user">
    <h1 class="mypage-title">{{ accountStore.user?.name }}의 Memory</h1>

    <div class="profile-image-container">
      <img
        :src="accountStore.user?.profile_image_url || defaultProfileImage"
        alt="프로필 이미지"
        class="profile-image"
      />
    </div>

    <h2 class="nickname">{{ accountStore.user?.name }}</h2>

    <div class="follow-row">
      <span class="follow-item">
        팔로워 {{ accountStore.user?.followers_count || 0 }}
      </span>
      <span class="follow-item" @click="goFollowing">
        팔로잉 {{ accountStore.user?.following_count || 0 }}
      </span>
    </div>

    <button class="bot-button" @click="">
      스포띠빠이와 함께리뷰쓰러가기
    </button>

    <h1 class="comment-text">
      코멘트 {{ accountStore.user?.comments_count || 0 }}
    </h1>

    <div class="comment-card-list">
      <CommentCard
        v-for="comment in accountStore.user?.recent_comments ?? []"
        :key="comment.comment_id"
        :profile-image="comment.user_profile_image"
        :content="comment.content"
        :user_name="comment.user_name"
      />
    </div>

    <button class="logout-button" @click="logout">로그아웃</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAccountStore } from '../stores/user'
import { useRouter } from 'vue-router'
import CommentCard from '@/components/CommentCard.vue'

const accountStore = useAccountStore()
const router = useRouter()
const defaultProfileImage = ''

const logout = () => {
  accountStore.logOut()
  router.replace('/')
}

const goFollowing = () => {
  if (accountStore.user?.user_id) {
    router.push(`/following/${accountStore.user.user_id}`)
  }
}

onMounted(async () => {
  if (accountStore.token) {
    await accountStore.getUserInfo()
    console.log('recent_comments:', accountStore.user)
  }
})
</script>
