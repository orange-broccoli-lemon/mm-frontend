import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import router from '@/router'

export interface UserProfile {
  email: string
  password?: string
  name?: string
  profile_image_url?: string
  followers_count: number
  following_count: number
  following_persons_count: number
  comments_count: number
  followers: []
  following: []
  following_persons: []
  recent_comments: []
}

export const useAccountStore = defineStore('account', () => {
  const AUTH_API = `https://i13m105.p.ssafy.io/api/v1/auth`
  const USERS_API = `https://i13m105.p.ssafy.io/api/v1/users`
  const token = ref<string | null>(localStorage.getItem('token'))
  const userId = ref<number | null>(JSON.parse(localStorage.getItem('userId') || 'null'))
  const user = ref<UserProfile | null>(null)

  // ✅ 유저 정보 조회: /users/{id} 사용
  async function getUserInfo() {
    if (!token.value || !userId.value) {
      console.warn('토큰 또는 유저 ID 없음, 사용자 정보 요청 생략')
      return { success: false, error: '토큰 또는 유저 ID 없음' }
    }
    try {
      const res = await axios.get(`${USERS_API}/${userId.value}`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "application/json"
        }
      })
      user.value = res.data as UserProfile
      return { success: true, data: res.data }
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('유저 정보 가져오기 실패:', error.response?.data || error.message)
      return { success: false, error: error.response?.data || error.message }
    }
  }

  async function login(userData: { email: string; password: string }) {
    try {
      const res = await axios.post(`${AUTH_API}/login/email`, userData, {
        headers: { "Content-Type": "application/json" }
      })
      console.log('로그인 응답 데이터:', res.data)
      console.log('로그인 되었습니다')

      const receivedToken = res.data?.access_token
      const receivedUserId = res.data?.user?.user_id

      if (!receivedToken || !receivedUserId) {
        throw new Error('응답에 토큰 또는 사용자 ID가 없습니다.')
      }

      token.value = receivedToken
      userId.value = receivedUserId
      localStorage.setItem('token', receivedToken)
      localStorage.setItem('userId', JSON.stringify(receivedUserId))

      const result = await getUserInfo()
      if (result.success) {
        console.log('유저 정보:', user.value)
        router.push('/')
      } else {
        logOut()
        throw new Error('유저 정보 가져오기 실패')
      }
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('로그인 실패', error.response?.data || error.message)
      logOut() // 실패 시 정리
    }
  }

  // 구글 로그인 함수 추가
  async function googleLogin(credential: string) {
    try {
      const res = await axios.post(`${AUTH_API}/login/google`, 
        { credential }, // Google ID Token을 credential로 전송
        {
          headers: { "Content-Type": "application/json" }
        }
      )
      
      console.log('구글 로그인 응답 데이터:', res.data)
      console.log('구글 로그인 되었습니다')

      const receivedToken = res.data?.access_token
      const receivedUserId = res.data?.user?.user_id

      if (!receivedToken || !receivedUserId) {
        throw new Error('응답에 토큰 또는 사용자 ID가 없습니다.')
      }

      token.value = receivedToken
      userId.value = receivedUserId
      localStorage.setItem('token', receivedToken)
      localStorage.setItem('userId', JSON.stringify(receivedUserId))

      const result = await getUserInfo()
      if (result.success) {
        console.log('유저 정보:', user.value)
        router.push('/')
        return { success: true }
      } else {
        logOut()
        throw new Error('유저 정보 가져오기 실패')
      }
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('구글 로그인 실패:', error.response?.data || error.message)
      logOut() // 실패 시 정리
      return { success: false, error: error.response?.data || error.message }
    }
  }

  async function signUp(userData: {
    name: string
    password: string
    email: string
    profile_image_url: string
  }) {
    try {
      await axios.post(`${AUTH_API}/signup/email`, userData, {
        headers: { "Content-Type": "application/json" }
      })
      console.log('회원가입 성공!')
      const loginData = {
        email: userData.email,
        password: userData.password
      }
      await login(loginData)
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
    console.log('로그아웃')
    router.push('/')
  }

  return { signUp, login, googleLogin, getUserInfo, token, userId, user, logOut }
})