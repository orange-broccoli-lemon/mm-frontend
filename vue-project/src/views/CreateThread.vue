<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThreadStore } from '@/stores/thread'  

const route = useRoute()
const router = useRouter()
const commentStore = useThreadStore()

const content = ref('')
const isSpoiler = ref(false)

const movieId = Number(route.params.id) || 1 

const handleCreateComment = async () => {
  if (!content.value.trim()) {
    alert('내용을 입력해주세요.')
    return
  }


await commentStore.createComment({
  movie_id: movieId,
  content: content.value,
  rating: 0,
  watched_date: new Date().toISOString().slice(0, 10),
  is_spoiler: isSpoiler.value,
  spoiler_confidence: 1,
  is_public: true
})

  alert('댓글 작성 완료!')
  router.push({ name: 'HotMovieDetailView', params: { id: movieId } })
}
</script>

<template>
  <div class="create-thread-container">
    <h1>댓글 작성</h1>
    <form @submit.prevent="handleCreateComment" class="thread-form">
      <div class="form-group">
        <label for="content">내용</label>
        <textarea id="content" v-model="content" placeholder="내용을 입력하세요"></textarea>
      </div>

      <div class="form-group">
        <label>
          <input type="checkbox" v-model="isSpoiler" />
          스포일러입니다
        </label>
      </div>
      
      <button type="submit" class="submit-btn">작성</button>
    </form>
  </div>
</template>
