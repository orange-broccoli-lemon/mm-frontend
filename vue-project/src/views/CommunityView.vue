<!-- <template>
  <div class="thread-list-container">
    <h1 class="thread-list-title">Thread List</h1>
    <div class="controls">
      <button @click="goToCreateThread" class="create-btn">글쓰기</button>
    </div>
    <div class="thread-card" v-for="thread in threadStore.threadList" :key="thread.id">
      <RouterLink class="thread-title" :to="{ name: 'ThreadDetail', params: { id: thread.id } }">
        {{ thread.title }}
      </RouterLink>
      <div class="thread-info">
        <p class="thread-user">작성일: {{ new Date(thread.created_at).toLocaleString() }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThreadStore } from '@/stores/thread'

const threadStore = useThreadStore()
const router = useRouter()

onMounted(async () => {
  await threadStore.allThreads()
})

const goToCreateThread = () => {
  router.push({ name: 'CreateThread', params: { id: 1 } }) // 임시 id 전달
}
</script>

<style scoped>
.thread-list-container { max-width: 800px; margin: 2rem auto; padding: 1rem; }
.thread-list-title { text-align: center; font-weight: bold; font-size: 1.8rem; color: #333; margin-bottom: 1rem; }
.controls { text-align: right; margin-bottom: 1rem; }
.create-btn { padding: 0.5rem 1rem; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
.create-btn:hover { background-color: #0056b3; }
.thread-card { border: 1px solid #ccc; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; display: flex; flex-direction: column; }
.thread-title { font-weight: 600; text-decoration: none; margin-bottom: 0.5rem; color: #333; }
.thread-title:hover { text-decoration: underline; }
.thread-info { display: flex; align-items: center; gap: 0.5rem; }
.thread-user { font-size: 0.9rem; color: #555; }
</style> -->
