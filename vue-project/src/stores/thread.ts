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
  // const BASE_API = `http://127.0.0.1:8000/community`
  const threadList = ref<Thread[]>([
    {id: 1, title: '첫번째 글', content: '첫번째 내용', created_at: new Date().toISOString()},
    {id: 2, title: '두번째 글', content: '두번째 내용', created_at: new Date().toISOString()},
  ])
  const thread = ref<Thread | null>(null)
  let nextId = 3

  const accountStore = useAccountStore()
  const router = useRouter()

  // 모든 쓰레드 가져오기
  const allThreads = async (): Promise<void> => {
    // try {
    //   const res = await axios.get<Thread[]>(`${BASE_API}/`)
    //   threadList.value = res.data
    // } catch (err) {
    //   const error = err as AxiosError
    //   console.error('ThreadList.get.error:', error.message)
    // }
    // 서버가 준비되지 않았으므로, 현재는 아무 작업도 하지 않습니다.
    // threadList는 초기 더미 데이터로 채워져 있습니다.
  }

  // 쓰레드 생성
  const createThread = async (book: number | string, threadData: CreateThreadData): Promise<void> => {
    // try {
    //   const res = await axios.post<Thread>(
    //     `${BASE_API}/create_thread/${book}`,
    //     threadData,
    //     { headers: { Authorization: `Token ${accountStore.token}` } }
    //   )
    //   console.log(res.data, '쓰레드가 생성됐다람쥐쥐')
    //   router.push({ name: 'ThreadDetail', params: { id: res.data.id } })
    // } catch (err) {
    //   const error = err as AxiosError
    //   console.error('Thread 생성 실패:', error.response?.data || error.message)
    // }
    const newThread: Thread = {
      id: nextId++,
      title: threadData.title,
      content: threadData.content,
      created_at: new Date().toISOString(),
    }
    threadList.value.push(newThread)
    console.log(newThread, '쓰레드가 생성됐다람쥐쥐')
    router.push({ name: 'ThreadDetail', params: { id: newThread.id } })
  }

  // 쓰레드 업데이트
  const updateThread = async (threadId: number, updatedData: UpdateThreadData): Promise<Thread | undefined> => {
    // try {
    //   const res = await axios.put<Thread>(
    //     `${BASE_API}/detail/${threadId}`,
    //     updatedData,
    //     { headers: { Authorization: `Token ${accountStore.token}` } }
    //   )
    //   console.log('쓰레드 업데이트 성공')
    //   thread.value = res.data
    //   return res.data
    // } catch (err) {
    //   const error = err as AxiosError
    //   console.error('쓰레드 업데이트 실패:', error.response?.data || error.message)
    //   throw err
    // }
    const index = threadList.value.findIndex(t => t.id === threadId)
    if (index !== -1) {
      const updatedThread = { ...threadList.value[index], ...updatedData }
      threadList.value[index] = updatedThread
      thread.value = updatedThread
      console.log('쓰레드 업데이트 성공')
      return updatedThread
    }
  }

  // 쓰레드 삭제
  const deleteThread = async (threadId: number): Promise<void> => {
    // try {
    //   const res = await axios.delete(`${BASE_API}/detail/${threadId}`, {
    //     headers: { Authorization: `Token ${accountStore.token}` }
    //   })
    //   console.log(res.data, '제거됐다람쥐쥐')
    //   await allThreads() // 삭제 후 최신 목록 갱신
    // } catch (err) {
    //   const error = err as AxiosError
    //   console.error('쓰레드 삭제 실패:', error.response?.data || error.message)
    // }
    const index = threadList.value.findIndex(t => t.id === threadId)
    if (index !== -1) {
      threadList.value.splice(index, 1)
      console.log('제거됐다람쥐쥐')
    }
  }

  // 쓰레드 상세 조회
  const detailThread = async (threadId: number): Promise<void> => {
    // try {
    //   const res = await axios.get<Thread>(`${BASE_API}/detail/${threadId}`)
    //   console.log(res.data, '상세정보???!!')
    //   thread.value = res.data
    // } catch (err) {
    //   const error = err as AxiosError
    //   console.error('상세 조회 실패:', error.response?.data || error.message)
    // }
    const foundThread = threadList.value.find(t => t.id === threadId)
    if (foundThread) {
      thread.value = foundThread
      console.log(foundThread, '상세정보???!!')
    } else {
      console.error('상세 조회 실패: 해당 ID의 쓰레드를 찾을 수 없습니다.')
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