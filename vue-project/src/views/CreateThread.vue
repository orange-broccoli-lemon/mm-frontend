<template>
  <div class="create-thread-container">
    <h1>새 쓰레드 생성</h1>
    <form @submit.prevent="handleCreateThread" class="thread-form">
      <div class="form-group">
        <label for="title">제목</label>
        <input id="title" v-model="title" placeholder="제목을 입력하세요" />
      </div>
      <div class="form-group">
        <label for="content">내용</label>
        <textarea id="content" v-model="content" placeholder="내용을 입력하세요"></textarea>
      </div>
      <div class="form-group">
        <label for="hashtags">해시태그</label>
        <input id="hashtags" v-model="hashtags" placeholder="#해시태그" />
      </div>
      <button type="submit" class="submit-btn">생성</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThreadStore } from '@/stores/thread'

const route = useRoute()
const router = useRouter()
const threadStore = useThreadStore()

const title = ref('')
const content = ref('')
const hashtags = ref('')
const bookId = Number(route.params.id)

const handleCreateThread = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    alert('제목과 내용을 입력해주세요.')
    return
  }

  const threadData = { title: title.value, content: content.value, hashtags: hashtags.value }
  await threadStore.createThread(bookId, threadData)
  alert('쓰레드 생성 완료!')
  router.push({ name: 'CommunityView' })
}
</script>

<style scoped>
.create-thread-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.thread-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

input,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
}

textarea {
  min-height: 150px;
  resize: vertical;
}

.submit-btn {
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}
</style>