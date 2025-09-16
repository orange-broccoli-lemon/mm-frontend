<template>
  <div class="callback-container">
    <div class="loading-spinner" v-if="isLoading">
      <div class="spinner"></div>
      <p>구글 로그인 처리 중...</p>
    </div>
    
    <div class="error-message" v-if="error">
      <h3>로그인 실패</h3>
      <p>{{ error }}</p>
      <button @click="goToLogin">로그인 페이지로 돌아가기</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const store = useAccountStore()

const isLoading = ref(true)
const error = ref('')

const handleGoogleCallback = async () => {
  try {
    // URL에서 authorization code나 token 파라미터 추출
    const code = route.query.code as string
    const state = route.query.state as string
    const errorParam = route.query.error as string

    // 에러가 있는 경우
    if (errorParam) {
      throw new Error(`구글 인증 실패: ${errorParam}`)
    }

    // authorization code가 없는 경우
    if (!code) {
      throw new Error('인증 코드를 받지 못했습니다.')
    }

    // 스토어의 구글 콜백 처리 함수 호출
    const result = await store.processGoogleCallback(code, state)
    
    if (result.success) {
      console.log('구글 로그인 성공!')
      router.push('/')
    } else {
      throw new Error(result.error || '로그인 처리 중 오류가 발생했습니다.')
    }

  } catch (err) {
    console.error('구글 로그인 콜백 처리 실패:', err)
    error.value = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}

onMounted(() => {
  handleGoogleCallback()
})
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #666;
  font-size: 1.1rem;
}

.error-message {
  text-align: center;
  max-width: 400px;
  padding: 2rem;
  border-radius: 8px;
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
}

.error-message h3 {
  color: #e53e3e;
  margin-bottom: 1rem;
}

.error-message p {
  color: #742a2a;
  margin-bottom: 1.5rem;
}

.error-message button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.error-message button:hover {
  background-color: #0056b3;
}
</style>