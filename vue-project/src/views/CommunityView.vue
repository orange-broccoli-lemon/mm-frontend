<template>
  <div class="thread-list-container">
    <h1 class="thread-list-title">Thread List</h1>
    <div class="thread-card" v-for="thread in threadStore.threadList" :key="thread.id">
      <RouterLink class="thread-title" :to="{ name: 'ThreadDetail', params: { id: thread.id } }">
        {{ thread.title }}
      </RouterLink>
      <div class="thread-info">
        <img class="thread-img" :src="thread.user_profile" alt="프로필 사진" />
        <p class="thread-user">작성자: {{ thread.username }}</p>
        <p class="book-title">책: {{ thread.book_title }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useThreadStore } from '@/stores/thread'

const threadStore = useThreadStore()

onMounted(async () => {
  await threadStore.allThreads()
})
</script>

<style scoped>
.thread-list-container { max-width: 800px; margin: 2rem auto; padding: 1rem; }
.thread-list-title { text-align: center; font-weight: bold; font-size: 1.8rem; color: #333; margin-bottom: 1rem; }
.thread-card { border: 1px solid #ccc; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; display: flex; flex-direction: column; }
.thread-title { font-weight: 600; text-decoration: none; margin-bottom: 0.5rem; }
.thread-title:hover { text-decoration: underline; }
.thread-info { display: flex; align-items: center; gap: 0.5rem; }
.thread-img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #aaa; }
.thread-user, .book-title { font-size: 0.9rem; color: #555; }
</style>
