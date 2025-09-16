import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import router from '@/router'

export interface User {
  username: string
  email: string
}

export interface UserProfile {
  email: string
  password?: string
  name?: string
  profile_image_url?: string
}

export const useAccountStore = defineStore('account', () => {
  const AUTH_API = `https://i13m105.p.ssafy.io/api/v1/auth`
  const USERS_API = `https://i13m105.p.ssafy.io/api/v1/users`
  const token = ref<string | null>(localStorage.getItem('token'))
  const userId = ref<number | null>(JSON.parse(localStorage.getItem('userId') || 'null'))
  const user = ref<UserProfile | null>(null)

  async function getUserInfo(id: number) {
    if (!token.value) {
      console.warn('토큰 없음, 사용자 정보 요청 생략')
      return { success: false, error: '토큰 없음' }
    }
    try {
      const res = await axios.get(`${USERS_API}/${id}`, {
        headers: { Authorization: `Token ${token.value}` },
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
      console.log('로그인 응답 데이터:', res.data);
      console.log('로그인 되었습니다')
      const receivedToken = res.data?.access_token
      const receivedUserId = res.data?.user?.user_id

      if (!receivedToken || !receivedUserId) {
        throw new Error('응답에 토큰 또는 사용자 ID가 없습니다.');
      }
      token.value = receivedToken;
      userId.value = receivedUserId;
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('userId', JSON.stringify(receivedUserId));

      const result = await getUserInfo(receivedUserId);
      if (result.success) {
        console.log('유저 정보:', user.value);
        router.push('/');
      } else {
        logOut();
        throw new Error('유저 정보 가져오기 실패');
      }
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error('로그인 실패', error.response?.data || error.message);
      logOut(); // Ensure cleanup on failure
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

  return { signUp, login, getUserInfo, token, userId, user, logOut }
})
