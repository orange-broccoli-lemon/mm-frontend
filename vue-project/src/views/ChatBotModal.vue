<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white dark:bg-gray-800 w-[500px] h-[650px] rounded-2xl shadow-xl flex flex-col">
      <!-- 헤더 -->
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700"
      >
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          스포띠파이 챗봇
        </h2>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✖
        </button>
      </div>

      <!-- 메시지 영역 -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="flex"
          :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="px-4 py-2 rounded-lg max-w-[75%] text-sm whitespace-pre-line"
            :class="
              msg.sender === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
            "
            v-html="msg.text"
          ></div>
        </div>
      </div>

      <!-- 입력 영역 -->
      <form
        @submit.prevent="sendMessage"
        class="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2"
      >
        <input
          v-model="input"
          type="text"
          placeholder="메시지를 입력하세요..."
          class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none"
        />
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          전송
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useBotStore } from '@/stores/bot'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const botStore = useBotStore()

const input = ref('')
const messages = ref<{ sender: 'user' | 'bot'; text: string }[]>([])

const chatContainer = ref<HTMLDivElement>()

const closeModal = () => emit('close')

const sendMessage = async () => {
  if (!input.value.trim()) return

  // 사용자 메시지 추가
  messages.value.push({ sender: 'user', text: input.value })

  const userMsg = input.value
  input.value = ''

  try {
    await botStore.chatingFindBot(userMsg)

    if (botStore.answer) {
      let botText = `
        제목: ${botStore.answer.title}<br/><br/>
        줄거리: ${botStore.answer.plot}<br/><br/>
        이유: ${botStore.answer.reason}
      `

      // movie_id가 있으면 보러가기 링크 추가
      if (botStore.answer.movie_id) {
        botText += `<br/><br/>👉 <a href="/movie/movieDetail/${botStore.answer.movie_id}" class="text-blue-600 hover:underline">보러가기</a>`
      }

      messages.value.push({
        sender: 'bot',
        text: botText
      })
    }
  } catch (err) {
    messages.value.push({ sender: 'bot', text: '⚠️ 오류가 발생했습니다.' })
  }

  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
</script>
