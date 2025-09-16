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

export const useThreadStore = defineStore('thread', () => {
  const BASE_API = 'https://i13m105.p.ssafy.io/api/v1/comments/' 
  const commentList = ref<Comment[]>([])
  const accountStore = useAccountStore()

  const createComment = async (commentData: CreateCommentData) => {
    try {
      const res = await axios.post<Comment>(BASE_API, commentData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accountStore.token}` 
        }
      })
      console.log('댓글 작성 성공', res.data)
      commentList.value.push(res.data)
    } catch (err) {
      const error = err as AxiosError
      console.error('댓글 작성 실패:', error.response?.data || error.message)
    }
  }

  return {
    commentList,
    createComment,
  }
})
