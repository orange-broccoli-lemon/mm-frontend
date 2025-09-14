<template>
  <div class="mypage-container" v-if="user">
    <h1 class="mypage-title">{{ user.nickName }}의 Memory</h1>

    <div class="profile-image-container">
      <img :src="user.profile || defaultProfileImage" alt="프로필 이미지" class="profile-image" />
    </div>

    <h2 class="nickname">{{ user.nickName }}</h2>

    <div class="follow-row">
      <span class="follow-item"> 팔로워 {{ user.followers?.length || 0 }}</span>
      <span class="follow-item"> 팔로잉 {{ user.followings?.length || 0 }}</span>
    </div>

    <button class="logout-button" @click="logout">로그아웃</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAccountStore } from '../stores/user'
import { useRouter } from 'vue-router'

interface UserProfile {
  nickName: string
  profile?: string
  followers?: any[]
  followings?: any[]
}

const accountStore = useAccountStore()
const router = useRouter()

const user = ref<UserProfile | null>(null)
const defaultProfileImage = '' 

const getUserInfo = async () => {
  if (!accountStore.token) return
  try {
    const result = await accountStore.getUserInfo()
    if (result.success) {
      // accountStore.user가 UserProfile 타입이면 바로 할당
      user.value = result.data as UserProfile
    }
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error)
  }
}

const logout = async () => {
  accountStore.logOut()
  router.replace('/') // 뒤로가기 방지
}

onMounted(() => {
  getUserInfo()
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
  color: #fff;
  background-color: #e2703a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-button:hover {
  background-color: #c65f2f;
}
</style>
