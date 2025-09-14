import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import { useAccountStore } from '@/stores/user'
import { useRouter } from 'vue-router'

// Thread 데이터 구조 (API 응답에 맞게 필요시 수정)
export interface Thread {
  id: number
  title: string
  content: string
  created_at: string
  
}

// Thread 생성 시 요청 데이터 구조
export interface CreateThreadData {
  title: string
  content: string
}

// Thread 업데이트 시 요청 데이터 구조 (보통 CreateThreadData와 동일)
export interface UpdateThreadData {
  title?: string
  content?: string
}

export const useThreadStore = defineStore('thread', () => {
  const BASE_API = `http://127.0.0.1:8000/community`
  const threadList = ref<Thread[]>([])
  const thread = ref<Thread | null>(null)

  const accountStore = useAccountStore()
  const router = useRouter()

  // 모든 쓰레드 가져오기
  const allThreads = async (): Promise<void> => {
    try {
      const res = await axios.get<Thread[]>(`${BASE_API}/`)
      threadList.value = res.data
    } catch (err) {
      const error = err as AxiosError
      console.error('ThreadList.get.error:', error.message)
    }
  }

  // 쓰레드 생성
  const createThread = async (book: number | string, threadData: CreateThreadData): Promise<void> => {
    try {
      const res = await axios.post<Thread>(
        `${BASE_API}/create_thread/${book}`,
        threadData,
        { headers: { Authorization: `Token ${accountStore.token}` } }
      )
      console.log(res.data, '쓰레드가 생성됐다람쥐쥐')
      router.push({ name: 'ThreadDetail', params: { id: res.data.id } })
    } catch (err) {
      const error = err as AxiosError
      console.error('Thread 생성 실패:', error.response?.data || error.message)
    }
  }

  // 쓰레드 업데이트
  const updateThread = async (threadId: number, updatedData: UpdateThreadData): Promise<Thread | undefined> => {
    try {
      const res = await axios.put<Thread>(
        `${BASE_API}/detail/${threadId}`,
        updatedData,
        { headers: { Authorization: `Token ${accountStore.token}` } }
      )
      console.log('쓰레드 업데이트 성공')
      thread.value = res.data
      return res.data
    } catch (err) {
      const error = err as AxiosError
      console.error('쓰레드 업데이트 실패:', error.response?.data || error.message)
      throw err
    }
  }

  // 쓰레드 삭제
  const deleteThread = async (threadId: number): Promise<void> => {
    try {
      const res = await axios.delete(`${BASE_API}/detail/${threadId}`, {
        headers: { Authorization: `Token ${accountStore.token}` }
      })
      console.log(res.data, '제거됐다람쥐쥐')
      await allThreads() // 삭제 후 최신 목록 갱신
    } catch (err) {
      const error = err as AxiosError
      console.error('쓰레드 삭제 실패:', error.response?.data || error.message)
    }
  }

  // 쓰레드 상세 조회
  const detailThread = async (threadId: number): Promise<void> => {
    try {
      const res = await axios.get<Thread>(`${BASE_API}/detail/${threadId}`)
      console.log(res.data, '상세정보???!!')
      thread.value = res.data
    } catch (err) {
      const error = err as AxiosError
      console.error('상세 조회 실패:', error.response?.data || error.message)
    }
  }

  return {
    threadList,
    thread,
    allThreads,
    createThread,
    updateThread,
    deleteThread,
    detailThread
  }
})
