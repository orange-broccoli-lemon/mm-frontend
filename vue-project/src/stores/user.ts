import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'vue-router'

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
  const BASE_API = `https://i13m105.p.ssafy.io/api/v1/auth`
  const token = ref<string | null>(null)
  const user = ref<User | UserProfile | null>(null)
  const router = useRouter()
const signUp = async (userData: {
  name: string
  password: string
  email: string
  profile_image_url: string
}) => {
  try {
    const res = await axios.post(`${BASE_API}/signup/email`, userData, {
      headers: { "Content-Type": "application/json" }
    })
    console.log('회원가입 성공!')
    token.value = res.data.key
    localStorage.setItem('token', res.data.key)
    router.push('/')
    await getUserInfo()
  } catch (err: unknown) {
    const error = err as AxiosError
    console.error('회원가입 실패:', error.response?.data || error.message)
  }
}

  const login = async (userData: { email: string; password: string }) => {
    try {
      const res = await axios.post(`${BASE_API}/login/email`, userData,{
        headers: { "Content-Type": "application/json" }
      })
      console.log('로그인 되었습니다')
      const receivedToken = res.data.key;
      token.value = receivedToken;
      localStorage.setItem('token', receivedToken); // Store token in localStorage

      const result = await getUserInfo(); // getUserInfo will use the token from the store
      if (result.success) {
        console.log('유저 정보:', user.value);
        router.push('/'); // Redirect on success
      } else {
        console.error('유저 정보 가져오기 실패:', result.error);
        // Optional: handle failed user info fetch, e.g., by logging out
        logOut();
      }
    } catch (err: unknown) {
      const error = err as AxiosError;
      console.error('로그인 실패', error.response?.data || error.message);
      // Optional: clear token and user data on login failure
      token.value = null;
      user.value = null;
      localStorage.removeItem('token');
    }
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
