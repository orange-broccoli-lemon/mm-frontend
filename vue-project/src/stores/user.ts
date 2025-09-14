import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'vue-router'

export interface User {
  username: string
  email: string
}

export interface UserProfile {
  nickName: string
  profile?: string
  followers?: any[]
  followings?: any[]
}


export const useAccountStore = defineStore('account', () => {
  const BASE_API = `http://127.0.0.1:8000/accounts`
  const token = ref<string | null>(null)
  const user = ref<User | UserProfile | null>(null)
  const router = useRouter()
  const signUp = (userData: FormData) => {
    axios.post(`${BASE_API}/signup/`, userData)
      .then(res => {
        console.log('회원가입 되었습니다.')
        token.value = res.data.key
      })
      .catch((err: AxiosError) => {
        console.error('회원가입 실패:', err.response?.data || err.message)
      })
  }

  const login = async (userData: { username: string; password: string }) => {
    try {
      const res = await axios.post(`${BASE_API}/login/`, userData)
      console.log('로그인 되었습니다')
      token.value = res.data.key

      const result = await getUserInfo()
      if (!result.success) {
        console.error('유저 정보 가져오기 실패:', result.error)
      } else {
        console.log('유저 정보:', user.value)
      }
    } catch (err: unknown) {
      const error = err as AxiosError
      console.error('로그인 실패', error.response?.data || error.message)
    }
    router.push('/')
  }

const getUserInfo = async () => {
  if (!token.value) {
    console.warn('토큰 없음, 사용자 정보 요청 생략')
    return { success: false, error: '토큰 없음' }
  }
  try {
    const res = await axios.get(`${BASE_API}/detail_user/`, {
      headers: { Authorization: `Token ${token.value}` },
    })
    user.value = res.data as UserProfile

    return { success: true, data: res.data }
  } catch (err: unknown) {
    const error = err as AxiosError
    return { success: false, error: error.response?.data || error.message }
  }
}


  const logOut = () => {
  token.value = null
  user.value = null
  localStorage.removeItem('token') 
  console.log('로그아웃')
  router.push('/')
  }

  return { signUp, login, getUserInfo, token, user, logOut  }
})
