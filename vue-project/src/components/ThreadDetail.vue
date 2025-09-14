<template>
  <div class="thread-detail-container" v-if="thread">
    <h2>{{ thread.title }}</h2>
    <p>{{ thread.content }}</p>
    <p>작성자: {{ thread.username }}</p>
    <p>책: {{ thread.book_title }}</p>

    <div v-if="userid === thread.user">
      <button @click="startEditing" v-if="!isEditing">✏️ 수정</button>
      <button @click="saveUpdate" v-else>💾 저장</button>
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
import { useAccountStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const threadStore = useThreadStore()
const accountStore = useAccountStore()

const thread = ref(threadStore.thread)
const isEditing = ref(false)
const updatedTitle = ref('')
const updatedContent = ref('')
const updatedHashtags = ref('')

const userid = accountStore.user.id

onMounted(async () => {
  const threadId = Number(route.params.id)
  if (!threadId) return
  await threadStore.detailThread(threadId)
  thread.value = threadStore.thread

  if (thread.value) {
    updatedTitle.value = thread.value.title || ''
    updatedContent.value = thread.value.content || ''
    updatedHashtags.value = thread.value.hashtag_list?.join(', ') || ''
  }
})

const startEditing = () => { isEditing.value = true }

const saveUpdate = async () => {
  const threadId = Number(route.params.id)
  if (!thread.value) return
  await threadStore.updateThread(threadId, {
    title: updatedTitle.value,
    content: updatedContent.value,
    hashtags: updatedHashtags.value.split(',').map(h => h.trim()).join(' ')
  })
  thread.value.title = updatedTitle.value
  thread.value.content = updatedContent.value
  thread.value.hashtag_list = updatedHashtags.value.split(',').map(h => h.trim())
  isEditing.value = false
}

const deleteThread = async () => {
  const threadId = Number(route.params.id)
  if (!thread.value) return
  await threadStore.deleteThread(threadId)
  router.push({ name: 'ThreadList' })
}
</script>
<template>
  <div class="thread-detail-container" v-if="thread">
    <h2>{{ thread.title }}</h2>
    <p>{{ thread.content }}</p>
    <p>작성자: {{ thread.username }}</p>
    <p>책: {{ thread.book_title }}</p>

    <div v-if="userid === thread.user">
      <button @click="startEditing" v-if="!isEditing">✏️ 수정</button>
      <button @click="saveUpdate" v-else>💾 저장</button>
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
import { useAccountStore } from '@/stores/account'

const route = useRoute()
const router = useRouter()
const threadStore = useThreadStore()
const accountStore = useAccountStore()

const thread = ref(threadStore.thread)
const isEditing = ref(false)
const updatedTitle = ref('')
const updatedContent = ref('')
const updatedHashtags = ref('')

const userid = accountStore.user.id

onMounted(async () => {
  const threadId = Number(route.params.id)
  if (!threadId) return
  await threadStore.detailThread(threadId)
  thread.value = threadStore.thread

  if (thread.value) {
    updatedTitle.value = thread.value.title || ''
    updatedContent.value = thread.value.content || ''
    updatedHashtags.value = thread.value.hashtag_list?.join(', ') || ''
  }
})

const startEditing = () => { isEditing.value = true }

const saveUpdate = async () => {
  const threadId = Number(route.params.id)
  if (!thread.value) return
  await threadStore.updateThread(threadId, {
    title: updatedTitle.value,
    content: updatedContent.value,
    hashtags: updatedHashtags.value.split(',').map(h => h.trim()).join(' ')
  })
  thread.value.title = updatedTitle.value
  thread.value.content = updatedContent.value
  thread.value.hashtag_list = updatedHashtags.value.split(',').map(h => h.trim())
  isEditing.value = false
}

const deleteThread = async () => {
  const threadId = Number(route.params.id)
  if (!thread.value) return
  await threadStore.deleteThread(threadId)
  router.push({ name: 'ThreadList' })
}
</script>
