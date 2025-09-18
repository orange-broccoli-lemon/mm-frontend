import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import router from '@/router'
import { useBotStore } from './bot'

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
  profile_review:string
  profile_review_date:string
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
  user_id:number
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
  const AUTH_API = `/api/v1/auth`
  const USERS_API = `/api/v1/users`
  const FOLLOWS_API = `/api/v1/persons`
  const MOVIE_API = `/api/v1/movies`


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

      console.log("user", user.value)
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
    console.log('로그아웃 처리 중...')
    token.value = null
    userId.value = null
    user.value = null
    commentList.value = null
    watch_list.value = null
    like_list.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    
    // 챗봇 채팅 기록 초기화
    const botStore = useBotStore()
    botStore.clearMessages()
    
    console.log('로그아웃 완료')
    router.push('/')
  }

  // 토큰 유효성 검사
  const validateToken = async () => {
    if (!token.value || !userId.value) {
      console.log('토큰 또는 사용자 ID가 없습니다')
      return false
    }

    try {
      console.log('토큰 유효성 검사 중...')
      const res = await axios.get(`${USERS_API}/${userId.value}`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "application/json"
        }
      })
      console.log('토큰 유효성 검사 성공')
      return res.status === 200
    } catch (error) {
      console.error('토큰 유효성 검사 실패:', error)
      // 토큰이 유효하지 않으면 로그아웃
      logOut()
      return false
    }
  }

  
  async function followUser(targetUserId: number) {
    if (!token.value) return
    
    try {
      // 사용자 팔로우 API 엔드포인트 수정
      const res = await axios.post(`${USERS_API}/${targetUserId}/follow`, {}, {
        headers: { Authorization: `Bearer ${token.value}`, 'Content-Type': 'application/json' }
      })
      
      // 팔로우 성공 후 현재 사용자 정보 새로고침
      if (user.value?.user_id) {
        await getUserInfo()
      }
      
      return res.data
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('팔로우 실패:', error.response?.data || error.message)
      
      // 401 오류 시 자동 로그아웃
      if (error.response?.status === 401) {
        console.log('토큰이 만료되었습니다. 자동 로그아웃합니다.')
        logOut()
        router.push('/login')
      }
      
      throw error // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있도록 함
    }
  }

  async function unFollowUser(targetUserId: number) {
    if (!token.value) return
    try {
      // 사용자 언팔로우 API 엔드포인트 수정
      await axios.delete(`${USERS_API}/${targetUserId}/follow`, { 
        headers: { Authorization: `Bearer ${token.value}` } 
      })
      console.log('사용자 팔로우 취소 성공:', targetUserId)
      
      // 언팔로우 성공 후 현재 사용자 정보 새로고침
      if (user.value?.user_id) {
        await getUserInfo()
      }
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('언팔로우 실패:', error.response?.data || error.message)
      console.error('언팔로우 API URL:', `${USERS_API}/${targetUserId}/follow`)
      
      // 401 오류 시 자동 로그아웃
      if (error.response?.status === 401) {
        console.log('토큰이 만료되었습니다. 자동 로그아웃합니다.')
        logOut()
        router.push('/login')
      }
      
      throw error // 에러를 다시 던져서 호출하는 곳에서 처리할 수 있도록 함
    }
  }
  async function getFollowers(targetUserId: number) {
    if (!token.value) return
    try {
      const res = await axios.get(`${USERS_API}/${targetUserId}/followers`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      return res.data
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('팔로워 가져오기 실패:', error.response?.data || error.message)
    }
  }
  async function getFollowing(targetUserId: number) {
    if (!token.value) return
    try {
      const res = await axios.get(`${USERS_API}/${targetUserId}/following`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      return res.data
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('팔로잉 가져오기 실패:', error.response?.data || error.message)
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
      
      // 401 에러 시 자동 로그아웃
      if (error.response?.status === 401) {
        console.log('토큰이 만료되었습니다. 자동 로그아웃합니다.')
        logOut()
        window.location.href = '/login'
      }
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
      
      // 401 에러 시 자동 로그아웃
      if (error.response?.status === 401) {
        console.log('토큰이 만료되었습니다. 자동 로그아웃합니다.')
        logOut()
        window.location.href = '/login'
      }
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
  if (!token.value) {
    console.log('토큰이 없어서 저장 목록을 가져올 수 없습니다')
    return
  }
  try {
    console.log('저장 목록 API 호출:', `${USERS_API}/${user_id}/watchlist`)
    const res = await axios.get(`${USERS_API}/${user_id}/watchlist`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    console.log('저장 목록 API 응답:', res.data)
    watch_list.value = res.data
    return res.data
  } catch (err: unknown) {
    const error = err as AxiosError
    console.error('저장 목록 가져오기 실패:', error.response?.data || error.message)
    console.error('에러 상태:', error.response?.status)
    
    // 401 에러 시 자동 로그아웃
    if (error.response?.status === 401) {
      console.log('토큰이 만료되었습니다. 자동 로그아웃합니다.')
      logOut()
      window.location.href = '/login'
    }
  }
}

const likeList = async (user_id:number) => {
  if (!token.value) {
    console.log('토큰이 없어서 좋아요 목록을 가져올 수 없습니다')
    return
  }
  try {
    console.log('좋아요 목록 API 호출:', `${USERS_API}/${user_id}/liked-movies`)
    const res = await axios.get(`${USERS_API}/${user_id}/liked-movies`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    console.log('좋아요 목록 API 응답:', res.data)
    like_list.value = res.data
    return res.data
  } catch (err: unknown) {
    const error = err as AxiosError
    console.error('좋아요 목록 가져오기 실패:', error.response?.data || error.message)
    console.error('에러 상태:', error.response?.status)
    
    // 401 에러 시 자동 로그아웃
    if (error.response?.status === 401) {
      console.log('토큰이 만료되었습니다. 자동 로그아웃합니다.')
      logOut()
      window.location.href = '/login'
    }
  }
}


  // 프로필 수정 함수
  const updateProfile = async (profileData: {
    name?: string
    password?: string
    current_password?: string
    profile_image_url?: File
  }) => {
    try {
      // 토큰 유효성 검사
      if (!token.value) {
        console.error('토큰이 없습니다.')
        return { success: false, error: '토큰이 없습니다. 다시 로그인해주세요.' }
      }

      const formData = new FormData()
      
      if (profileData.name) {
        formData.append('name', profileData.name)
      }
      
      if (profileData.password) {
        formData.append('password', profileData.password)
      }
      
      if (profileData.current_password) {
        formData.append('current_password', profileData.current_password)
      }
      
      if (profileData.profile_image_url) {
        formData.append('profile_image_url', profileData.profile_image_url)
      }

      console.log('프로필 업데이트 요청 시작, 토큰:', token.value ? '존재함' : '없음')

      const response = await axios.put(
        'https://i13m105.p.ssafy.io/api/v1/users/me/profile',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token.value}`
            // Content-Type은 multipart/form-data일 때 자동으로 설정되도록 제거
          }
        }
      )

      if (response.data.user) {
        user.value = response.data.user
        console.log('프로필 업데이트 성공:', response.data)
        return { success: true, data: response.data }
      }
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('프로필 업데이트 실패:', error.response?.data || error.message)
      console.error('응답 상태:', error.response?.status)
      console.error('응답 헤더:', error.response?.headers)
      
      // 401 오류 시 토큰 만료로 간주하고 로그아웃 처리
      if (error.response?.status === 401) {
        console.log('토큰이 만료되었습니다. 로그아웃 처리합니다.')
        logOut()
        return { success: false, error: '인증이 만료되었습니다. 다시 로그인해주세요.' }
      }
      
      return { success: false, error: error.response?.data || error.message }
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
    validateToken,
    followUser,
    unFollowUser,
    getFollowers,
    getFollowing,
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
    googleLogin,
    updateProfile

  }
})
