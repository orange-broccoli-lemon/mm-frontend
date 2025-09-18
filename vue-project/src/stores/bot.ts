import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'

interface BotAnswer {
  success: boolean
  title: string
  movie_id: number
  reason: string
  plot: string
  message: string | null
}

interface ChatMessage {
  sender: 'user' | 'bot'
  text: string
}

export const useBotStore = defineStore('bot', () => {
  const answer = ref<BotAnswer | null>(null)
  const messages = ref<ChatMessage[]>([
    {
      sender: 'bot',
      text: `안녕하세요 🎬 <strong>스포띠빠이</strong> 입니다!<br/>
찾으시는 영화가 있으신가요?<br/><br/>
다음과 같이 입력해보는 건 어떨까요?<br/><br/>
- "✨ ~한 장면이 있는 영화 제목이 뭐야?"<br/>
- "✨ ~배우가 나오고 ~한 내용인 영화 찾아줘"<br/>
- "✨ ~라는 대사가 나오는 영화 찾아줘"<br/>
- "✨ 줄거리가 ~인 영화 제목 알려줘"<br/>
- "✨ OST에 ~노래가 나오는 영화 찾아줘"`
    }
  ])

  const BOT_API = 'https://i13m105.p.ssafy.io/api/v1/ai/findbot'

  const chatingFindBot = async (quest: string) => {
    try {
      const res = await axios.post(
        BOT_API,
        { query: quest },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )

      answer.value = res.data as BotAnswer
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('챗봇 실패: ', error.response?.data || error.message)
    }
  }

  // 메시지 추가 함수
  const addMessage = (message: ChatMessage) => {
    messages.value.push(message)
  }

  // 채팅 기록 초기화 함수 (로그아웃 시 사용)
  const clearMessages = () => {
    messages.value = [
      {
        sender: 'bot',
        text: `안녕하세요 🎬 <strong>스포띠빠이</strong> 입니다!<br/>
찾으시는 영화가 있으신가요?<br/><br/>
다음과 같이 입력해보는 건 어떨까요?<br/><br/>
- "✨ ~한 장면이 있는 영화 제목이 뭐야?"<br/>
- "✨ ~배우가 나오고 ~한 내용인 영화 찾아줘"<br/>
- "✨ ~라는 대사가 나오는 영화 찾아줘"<br/>
- "✨ 줄거리가 ~인 영화 제목 알려줘"<br/>
- "✨ OST에 ~노래가 나오는 영화 찾아줘"`
      }
    ]
  }

  return { chatingFindBot, answer, messages, addMessage, clearMessages }
})
