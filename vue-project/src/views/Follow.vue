<template>
<h1>{{ userStore.user?.name }}의 팔로잉</h1>
<input type="text" placeholder="검색">
<!-- <UserCard
        v-for="user in userStore.user?.followers"
      /> -->
</template>

<script setup lang="ts">
import UserCard from '@/components/UserCard.vue';
import { useAccountStore } from '@/stores/user';
import { onMounted, ref } from 'vue'
const userStore = useAccountStore()

onMounted(() => {
  if (userStore.token) {
    userStore.getUserInfo()  
  }
})
</script>

<style scoped>

</style>