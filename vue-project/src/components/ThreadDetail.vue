<!-- <template>
  <div class="thread-detail-container" v-if="thread">
    <h2>{{ thread.title }}</h2>
    <p>{{ thread.content }}</p>
    <p>작성일: {{ new Date(thread.created_at).toLocaleString() }}</p>

    <div>
      <button @click="deleteThread">🗑️ 삭제</button>
    </div>
  </div>
  <div v-else>
    <p>쓰레드를 찾을 수 없습니다.</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThreadStore } from '@/stores/thread'

const route = useRoute()
const router = useRouter()
const threadStore = useThreadStore()

const thread = ref(threadStore.thread)

onMounted(async () => {
  const threadId = Number(route.params.id)
  if (!threadId) return
  await threadStore.detailThread(threadId)
  // store의 thread는 ref()로 감싸져있지 않으므로, .value로 접근하지 않습니다.
  thread.value = threadStore.thread 
})

const deleteThread = async () => {
  const threadId = Number(route.params.id)
  if (!thread.value) return
  await threadStore.deleteThread(threadId)
  router.push({ name: 'CommunityView' })
}
</script> -->

<template>
<h1>커뮤니티</h1>

</template>

<script lang="ts" setup>
</script>

<style scoped>
</style>