<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-95 translate-y-4"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-95 translate-y-4"
  >
    <div v-if="isOpen" class="fixed z-50" :style="{ bottom: '24px', right: '24px' }">
      <!-- 확장 가능한 챗봇 패널 -->
      <div 
        ref="chatPanel"
        class="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden relative"
        :style="{ width: chatWidth + 'px', height: chatHeight + 'px' }"
      >
        <!-- 헤더 -->
      <div class="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <img src="@/assets/spotti.png" alt="Spotti" class="w-5 h-5 object-contain" />
          </div>
          <h2 class="text-base font-medium text-gray-800 dark:text-gray-100">
            SpottiBye
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
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900" style="scroll-behavior: smooth; display: flex; flex-direction: column-reverse;">
        <div
          v-for="(msg, idx) in [...botStore.messages].reverse()"
          :key="botStore.messages.length - 1 - idx"
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
        
        <!-- 리사이즈 핸들 -->
      <div 
        ref="resizeHandle"
        class="absolute top-0 left-0 w-4 h-4 cursor-nw-resize opacity-0 hover:opacity-100 transition-opacity duration-200"
        @mousedown="startResize"
      >
        <div class="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-br-lg">
          <svg class="w-3 h-3 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16 8l-1.41-1.41L9 12.17V0H7v12.17l-5.59-5.58L0 8l8 8 8-8z"/>
          </svg>
        </div>
        </div>
      </div>
    </div>
  </Transition>
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
const chatContainer = ref<HTMLDivElement>()
const chatPanel = ref<HTMLDivElement>()
const resizeHandle = ref<HTMLDivElement>()

// 채팅창 크기 상태
const chatWidth = ref(420)
const chatHeight = ref(650)

// 채팅창 위치 상태 (상단 왼쪽 리사이즈를 위해)
const chatLeft = ref(0)
const chatTop = ref(0)

// 리사이즈 관련 상태
const isResizing = ref(false)
const startX = ref(0)
const startY = ref(0)
const startWidth = ref(0)
const startHeight = ref(0)
const startLeft = ref(0)
const startTop = ref(0)

// 스크롤을 맨 아래로 이동시키는 함수 (column-reverse 사용 시)
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = 0
  }
}

// messages 배열이 변경될 때마다 자동으로 스크롤
watch(() => botStore.messages, () => {
  scrollToBottom()
}, { deep: true })

// 리사이즈 시작
const startResize = (e: MouseEvent) => {
  e.preventDefault()
  isResizing.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  startWidth.value = chatWidth.value
  startHeight.value = chatHeight.value
  
  // 현재 채팅창의 위치 계산 (우측 하단 기준)
  const rect = chatPanel.value?.getBoundingClientRect()
  if (rect) {
    startLeft.value = window.innerWidth - rect.right
    startTop.value = window.innerHeight - rect.bottom
  }
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'nw-resize'
  document.body.style.userSelect = 'none'
}

// 리사이즈 중
const handleResize = (e: MouseEvent) => {
  if (!isResizing.value) return
  
  const deltaX = startX.value - e.clientX  // 반대 방향으로 계산
  const deltaY = startY.value - e.clientY  // 반대 방향으로 계산
  
  const newWidth = Math.max(300, Math.min(800, startWidth.value + deltaX))
  const newHeight = Math.max(400, Math.min(900, startHeight.value + deltaY))
  
  chatWidth.value = newWidth
  chatHeight.value = newHeight
}

// 리사이즈 종료
const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}


const sendMessage = async () => {
  if (!input.value.trim()) return

  // 사용자 메시지 추가
  botStore.addMessage({ sender: 'user', text: input.value })

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
        console.log("여기아이디왔어요~~~~~ ",botStore.answer.movie_id)
      }

      botStore.addMessage({
        sender: 'bot',
        text: botText
      })
    }
  } catch (err) {
    botStore.addMessage({ sender: 'bot', text: '⚠️ 오류가 발생했습니다.' })
  }
}

// 컴포넌트 언마운트 시 이벤트 리스너 정리
onUnmounted(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
})
</script>
