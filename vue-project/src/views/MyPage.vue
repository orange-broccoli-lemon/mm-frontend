<template>
  <div class="mypage-container" v-if="accountStore.user">
    <h1 class="mypage-title">{{ accountStore.user.name }}의 Memory</h1>

    <div class="profile-image-container">
      <img
        :src="accountStore.user.profile_image_url || defaultProfileImage"
        alt="프로필 이미지"
        class="profile-image"
      />
    </div>

    <h2 class="nickname">{{ accountStore.user.name }}</h2>

    <div class="follow-row">
      <span class="follow-item">
        팔로워 {{ accountStore.user.followers_count || 0 }}
      </span>
      <span class="follow-item" @click="goFollowing">
        팔로잉 {{ accountStore.user.following_count || 0 }}
      </span>
    </div>

    <button class="bot-button" @click="">
      스포띠빠이와 함께리뷰쓰러가기
    </button>

    <h1 class="comment-text">
      코멘트 {{ accountStore.user.comments_count }}
    </h1>

   
    <div class="comment-card-list">
      <CommentCard
        v-for="comment in accountStore.user.recent_comments"
        :key="comment.comment_id"
        :profile-image="comment.user_profile_image" 
        :content="comment.content"
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

onMounted(() => {
  if (accountStore.token) {
    accountStore.getUserInfo()
  }
})
</script>

<style scoped>

.mypage-container {
  min-height: 100vh;
  background: #f7f9fb;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
}

.mypage-title {
  font-size: 2rem;
  font-weight: bold;
  color: #e2703a;
  margin-bottom: 2rem;
  text-align: center;
}

.profile-image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}
.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #e2703a;
  object-fit: cover;
}

.comment-text {
  width: 100%;        
  text-align: left;    
  margin-left: 400px; 
  margin-top: 50px;
  color:#e2703a;     
}
.nickname {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.follow-row {
  display: flex;
  gap: 30px;
  margin-top: 0.5rem;
}
.follow-item {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.logout-button {
  margin-top: 2rem;
  padding: 10px 20px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #000000;
  background-color: #e2703a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.bot-button {
  margin-top: 2rem;
  padding: 10px 480px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #000000;
  background-color: #e89b77;
  border: none;
  border-radius: 26px;
  cursor: pointer;  
  transition: background 0.3s;
}

.logout-button:hover {
  background-color: #c65f2f;
}

.comment-card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
  width: 100%;
  padding-left: 20px;
}
</style>
