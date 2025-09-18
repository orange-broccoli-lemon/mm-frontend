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

export const useBotStore = defineStore('bot', () => {
  const answer = ref<BotAnswer | null>(null)

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

  return { chatingFindBot, answer }
})
