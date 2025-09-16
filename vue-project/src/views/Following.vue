<template>
  <div v-if="userStore.user">
    <h1>{{ userStore.user.name }}의 팔로잉</h1>
    <input type="text" placeholder="검색" />
    
    <UserCard
      v-for="follower in userStore.user.followers"
      :key="follower.user_id"
      :id="follower.user_id"
      :name="follower.name"
      :image="follower.profile_image_url"
    />
  </div>

</template>

<script setup lang="ts">
import UserCard from '@/components/UserCard.vue';
import { useAccountStore } from '@/stores/user';
import { onMounted, ref } from 'vue'
const userStore = useAccountStore()

onMounted(() => {
  console.log("userFollowing")
  if (userStore.token) {
    userStore.getUserInfo()  
  }
})
</script>

<style scoped>

</style>

