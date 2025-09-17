import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import router from '@/router'

export interface User {
  user_id: number
  username: string
  email: string
}

interface Follower {
  user_id: number
  name: string
  profile_image_url?: string
}

export interface RecentComments {
  comment_id: number
  movie_id: number
  user_id: number
  content: string
  rating: number
  watched_date: string
  is_spoiler: boolean
  spoiler_confidence: string
  is_public: boolean
  likes_count: number
  is_liked: boolean
  create_at: string
  update_at: string
  user_name: string
  user_profile_image: string
}

export interface UserProfile {
  user_id: number
  email: string
  password?: string
  name?: string
  profile_image_url?: string
  followers_count: number
  following_count: number
  following_persons_count: number
  comments_count: number
  followers: Follower[]
  following: Follower[]
  following_persons: []
  recent_comments: RecentComments[]
}

export interface UserComment {
  comment_id: number
  content: string
  rating: string
  watched_date: string
  is_spoiler: boolean
  is_public: boolean
  likes_count: number
  create_at: string
  movie_id: number
  movie_title: string
  movie_poster_url: string
  movie_release_date: string
}

export interface LikeData {
  user_id: number
  movie_id: number
  created_at: string
}

export interface WatchList {
  user_id: number
  movie_id: number
  created_at: string
}

export interface Like{
  movie_id: number
  title: string 
  poster_url:string 
  release_date:string
  average_rating:string
  added_at:string 
}

export interface Watch{
  movie_id:number
  title:string
  poster_url:string
  release_date:string
  average_rating:string
  added_at:string
}
export const useAccountStore = defineStore('account', () => {
  const AUTH_API = `https://i13m105.p.ssafy.io/api/v1/auth`
  const USERS_API = `https://i13m105.p.ssafy.io/api/v1/users`
  const FOLLOWS_API = `https://i13m105.p.ssafy.io/api/v1/follows/`
  const MOVIE_API = `https://i13m105.p.ssafy.io/api/v1/movies`


  const token = ref<string | null>(localStorage.getItem('token'))
  const userId = ref<number | null>(JSON.parse(localStorage.getItem('userId') || 'null'))
  const user = ref<UserProfile | null>(null)
  const commentList = ref<UserComment[] | null>(null)
  const watch_list = ref<Watch[] | null>(null)
  const like_list = ref<Like[] | null>(null)
  
  const initializeAuth = async () => {
    if (token.value && userId.value) {
      try {
        await getUserInfo()
      } catch {
        logOut()
      }
    }
  }

  async function getUserInfo() {
    if (!token.value || !userId.value) return
    try {
      const res = await axios.get(`${USERS_API}/${userId.value}`, {
        headers: { Authorization: `Bearer ${token.value}`, Accept: "application/json" }
      })
      user.value = res.data as UserProfile
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('유저 정보 가져오기 실패:', error.response?.data || error.message)
    }
  }

 async function googleLogin(idToken: string) {
    try {
      console.log('Google 로그인 시작 - ID Token:', idToken.substring(0, 50) + '...')
      
      const res = await axios.post(`${AUTH_API}/login/google`, 
        { id_token: idToken }, // 백엔드에서 요구하는 id_token 형태로 전송
        {
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        }
      )
      
      console.log('구글 로그인 응답 데이터:', res.data)
      console.log('구글 로그인 성공!')

      const receivedToken = res.data?.access_token
      const receivedUser = res.data?.user
      const receivedUserId = receivedUser?.user_id

      if (!receivedToken || !receivedUserId) {
        throw new Error('응답에 토큰 또는 사용자 ID가 없습니다.')
      }

      // 토큰과 사용자 정보 저장
      token.value = receivedToken
      userId.value = receivedUserId
      user.value = receivedUser // 백엔드에서 받은 사용자 정보 저장
      localStorage.setItem('token', receivedToken)
      localStorage.setItem('userId', JSON.stringify(receivedUserId))

      console.log('사용자 정보 저장 완료:', receivedUser)
      router.push('/')
      return { success: true, data: receivedUser }
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('구글 로그인 실패:', error.response?.data || error.message)
      
      // 백엔드에서 받은 에러 메시지 처리
      let errorMessage = 'Google 로그인에 실패했습니다.'
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        } else if (error.response.data && typeof error.response.data === 'object' && 'detail' in error.response.data) {
          errorMessage = (error.response.data as any).detail
        }
      }
      
      logOut() // 실패 시 정리
      return { success: false, error: errorMessage }
    }
  }

  async function login(userData: { email: string; password: string }) {
    try {
      const res = await axios.post(`${AUTH_API}/login/email`, userData, {
        headers: { "Content-Type": "application/json" }
      })
      const receivedToken = res.data?.access_token
      const receivedUserId = res.data?.user?.user_id
      if (!receivedToken || !receivedUserId) throw new Error('응답에 토큰 또는 사용자 ID가 없습니다.')
      token.value = receivedToken
      userId.value = receivedUserId
      localStorage.setItem('token', receivedToken)
      localStorage.setItem('userId', JSON.stringify(receivedUserId))
      await getUserInfo()
      router.push('/')
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('로그인 실패:', error.response?.data || error.message)
      logOut()
    }
  }

  async function signUp(userData: { name: string; password: string; email: string; profile_image_url: string }) {
    try {
      await axios.post(`${AUTH_API}/signup/email`, userData, { headers: { "Content-Type": "application/json" } })
      await login({ email: userData.email, password: userData.password })
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('회원가입 실패:', error.response?.data || error.message)
    }
  }

  function logOut() {
    token.value = null
    userId.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    router.push('/')
  }

  
  async function followUser(targetUserId: number) {
    if (!token.value) return
    try {
      const res = await axios.post(FOLLOWS_API, { following_id: targetUserId }, {
        headers: { Authorization: `Bearer ${token.value}`, 'Content-Type': 'application/json' }
      })
      return res.data
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('팔로우 실패:', error.response?.data || error.message)
    }
  }


  const userComment = async (targetUserId: number) => {
    if (!token.value) return
    try {
      const res = await axios.get<UserComment[]>(`${USERS_API}/${targetUserId}/comments`, {
        headers: { Authorization: `Bearer ${token.value}`, Accept: 'application/json' }
      })
      commentList.value = res.data
      return res.data
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('유저 댓글 가져오기 실패:', error.response?.data || error.message)
    }
  }

  
  const addLikeMovie = async (movie_id: number) => {
    if (!token.value) return
    try {
      const res = await axios.post<LikeData>(
        `${MOVIE_API}/${movie_id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token.value}` } }
      )
      console.log('좋아요 성공:', res.data)
      return res.data
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('좋아요 실패:', error.response?.data || error.message)
    }
  }

  const unlikeMovie = async (movie_id: number) => {
    if (!token.value) return
    try {
      await axios.delete(`${MOVIE_API}/${movie_id}/like`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      console.log('좋아요 취소 성공:', movie_id)
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('좋아요 취소 실패:', error.response?.data || error.message)
    }
  }

  
  const addWatchList = async (movie_id: number) => {
    if (!token.value) return
    try {
      const res = await axios.post<WatchList>(`${MOVIE_API}/${movie_id}/watchlist`, {}, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      console.log('저장 성공:', res.data)
      return res.data
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('저장 실패:', error.response?.data || error.message)
    }
  }

  const unWatchMovie = async (movie_id: number) => {
    if (!token.value) return
    try {
      await axios.delete(`${MOVIE_API}/${movie_id}/watchlist`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      console.log('저장 취소 성공:', movie_id)
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('저장 취소 실패:', error.response?.data || error.message)
    }
  }


  const watchList = async (user_id:number) => {
  if (!token.value) return
  try {
    const res = await axios.get(`${USERS_API}/${user_id}/watchlist`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    watch_list.value = res.data
    return res.data
  } catch (err: unknown) {
    const error = err as AxiosError
    console.error('저장 목록 가져오기 실패:', error.response?.data || error.message)
  }
}

const likeList = async (user_id:number) => {
  if (!token.value) return
  try {
    const res = await axios.get(`${USERS_API}/${user_id}/liked-movies`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    like_list.value = res.data
    return res.data
  } catch (err: unknown) {
    const error = err as AxiosError
    console.error('좋아요 목록 가져오기 실패:', error.response?.data || error.message)
  }
}


  return {
    signUp,
    login,
    getUserInfo,
    token,
    userId,
    user,
    logOut,
    followUser,
    initializeAuth,
    userComment,
    commentList,
     addLikeMovie,
    unlikeMovie,
     addWatchList,
    unWatchMovie,
    watchList,
    likeList,
    like_list,
    watch_list,
    googleLogin

  }
})
