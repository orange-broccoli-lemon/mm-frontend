<template>
  <div v-if="isOpen" class="fixed bottom-6 right-6 z-50">
    <!-- 확장 가능한 챗봇 패널 -->
    <div 
      class="bg-white dark:bg-gray-900 w-[380px] h-[580px] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
    >
      <!-- 헤더 -->
      <div class="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <img src="@/assets/spotti.png" alt="Spotti" class="w-5 h-5 object-contain" />
          </div>
          <h2 class="text-base font-medium text-gray-800 dark:text-gray-100">
            Spotti
          </h2>
        </div>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 메시지 영역 -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="flex"
          :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="px-3 py-2 rounded-2xl max-w-[80%] text-sm whitespace-pre-line"
            :class="
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
            "
            v-html="msg.text"
          ></div>
        </div>
        
      </div>

      <!-- 입력 영역 -->
      <form
        @submit.prevent="sendMessage"
        class="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center space-x-2">
          <input
            v-model="input"
            type="text"
            placeholder="메시지를 입력하세요..."
            class="flex-1 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
          <button
            type="submit"
            :disabled="!input.trim()"
            class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import { useBotStore } from '@/stores/bot'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const botStore = useBotStore()

const input = ref('')
const messages = ref<{ sender: 'user' | 'bot'; text: string }[]>([
  {
    sender: 'bot',
    text: `안녕하세요 🎬 <strong>스포띠파이</strong> 입니다!<br/>
찾으시는 영화가 있으신가요?<br/><br/>
다음과 같이 입력해보는 건 어떨까요?<br/><br/>
- "✨ ~한 장면이 있는 영화 제목이 뭐야?"<br/>
- "✨ ~배우가 나오고 ~한 내용인 영화 찾아줘"<br/>
- "✨ ~라는 대사가 나오는 영화 찾아줘"<br/>
- "✨ 줄거리가 ~인 영화 제목 알려줘"<br/>
- "✨ OST에 ~노래가 나오는 영화 찾아줘"`
  }
])

const chatContainer = ref<HTMLDivElement>()


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
