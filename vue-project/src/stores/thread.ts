import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import { useAccountStore } from '@/stores/user'

export interface Comment {
  comment_id: number
  movie_id: number
  user_id: number
  content: string
  rating: string
  watched_date: string
  is_spoiler: boolean
  spoiler_confidence: string
  is_public: boolean
  likes_count: number
  is_liked: boolean
  created_at: string
  updated_at: string
  user_name: string
  user_profile_image: string
}

export interface CreateCommentData {
  movie_id: number
  content: string
  rating: number
  watched_date: string
  is_spoiler: boolean
  spoiler_confidence: number
  is_public: boolean
}

export interface UpdateCommentData {
  content: string
  rating: number
  is_spoiler: boolean
  spoiler_confidence: number
  is_public: boolean
}

export const useThreadStore = defineStore('thread', () => {
  const BASE_API = 'https://i13m105.p.ssafy.io/api/v1/comments/' 
  const commentList = ref<Comment[]>([])
  const accountStore = useAccountStore()

  const createComment = async (commentData: CreateCommentData) => {
    try {
      console.log('댓글 작성 시도:', commentData)
      console.log('사용자 토큰:', accountStore.token ? '토큰 있음' : '토큰 없음')
      
      if (!accountStore.token) {
        throw new Error('로그인이 필요합니다.')
      }
      
      const res = await axios.post<Comment>(BASE_API, commentData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accountStore.token}`,
          Accept: 'application/json'
        }
      })
      console.log('댓글 작성 성공', res.data)
      commentList.value.push(res.data)
      return res.data
    } catch (err) {
      const error = err as AxiosError
      console.error('댓글 작성 실패:', error.response?.data || error.message)
      console.error('상세 오류:', error.response?.status, error.response?.statusText)
      throw error // 오류를 다시 던져서 호출하는 곳에서 처리할 수 있도록 함
    }
  }

  const updateComment = async (commentId: number, commentData: UpdateCommentData) => {
    try {
      console.log('댓글 수정 시도:', { commentId, commentData })
      console.log('사용자 토큰:', accountStore.token ? '토큰 있음' : '토큰 없음')
      
      if (!accountStore.token) {
        throw new Error('로그인이 필요합니다.')
      }
      
      const res = await axios.put<Comment>(`${BASE_API}${commentId}`, commentData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accountStore.token}`,
          Accept: 'application/json'
        }
      })
      console.log('댓글 수정 성공', res.data)
      
      // 기존 댓글 업데이트
      const index = commentList.value.findIndex(comment => comment.comment_id === commentId)
      if (index !== -1) {
        commentList.value[index] = res.data
      }
      return res.data
    } catch (err) {
      const error = err as AxiosError
      console.error('댓글 수정 실패:', error.response?.data || error.message)
      console.error('상세 오류:', error.response?.status, error.response?.statusText)
      throw error
    }
  }

  return {
    commentList,
    createComment,
    updateComment,
  }
})
