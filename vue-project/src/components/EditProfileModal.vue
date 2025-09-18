<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <!-- 헤더 -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
            프로필 수정
          </h2>
          <button
            @click="emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- 폼 -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- 이름 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              이름
            </label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="이름을 입력하세요"
            />
          </div>

          <!-- 현재 비밀번호 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              현재 비밀번호
            </label>
            <input
              v-model="formData.current_password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="현재 비밀번호를 입력하세요"
            />
          </div>

          <!-- 새 비밀번호 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              새 비밀번호
            </label>
            <input
              v-model="formData.password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="새 비밀번호를 입력하세요 (8자 이상)"
            />
          </div>

          <!-- 프로필 이미지 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              프로필 이미지
            </label>
            <div class="flex items-center space-x-4">
              <div 
                class="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 relative cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                @click="fileInput?.click()"
              >
                <img
                  v-if="previewImage || accountStore.user?.profile_image_url"
                  :src="previewImage || getProfileImageUrl(accountStore.user?.profile_image_url)"
                  alt="프로필 미리보기"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <!-- 편집 아이콘 -->
                <div class="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </div>
              </div>
              <div class="flex-1">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleFileChange"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="fileInput?.click()"
                  class="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 border border-purple-300 dark:border-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
                >
                  이미지 선택
                </button>
              </div>
            </div>
          </div>

          <!-- 버튼 -->
          <div class="flex space-x-3 pt-4">
            <button
              type="button"
              @click="emit('close')"
              class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors duration-200"
            >
              취소
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="flex-1 px-4 py-2 text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              {{ isLoading ? '저장 중...' : '저장' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useAccountStore } from '@/stores/user'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const accountStore = useAccountStore()

// 폼 데이터
const formData = reactive({
  name: '',
  password: '',
  current_password: '',
  profile_image_url: null as File | null
})

const previewImage = ref('')
const isLoading = ref(false)
const fileInput = ref<HTMLInputElement>()

// 모달이 열릴 때 현재 사용자 정보로 폼 초기화
watch(() => props.isOpen, (newValue) => {
  if (newValue && accountStore.user) {
    formData.name = accountStore.user.name || ''
    formData.password = ''
    formData.current_password = ''
    formData.profile_image_url = null
    previewImage.value = accountStore.user.profile_image_url || ''
  }
})

// 파일 선택 처리
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    formData.profile_image_url = file
    
    // 미리보기 생성
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// 프로필 이미지 URL을 절대 경로로 변환
const getProfileImageUrl = (url?: string) => {
  if (!url) return ''
  
  // 이미 절대 URL인 경우 (http:// 또는 https://로 시작)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // 상대 경로인 경우 서버 주소 추가
  const baseUrl = 'https://i13m105.p.ssafy.io'
  return `${baseUrl}${url}`
}

// 이미지 로딩 에러 처리
const handleImageError = () => {
  console.log('프로필 이미지 로딩 실패')
  previewImage.value = ''
}

// 폼 제출 처리
const handleSubmit = async () => {
  if (!formData.name.trim()) {
    alert('이름을 입력해주세요.')
    return
  }

  if (formData.password && formData.password.length < 8) {
    alert('새 비밀번호는 8자 이상이어야 합니다.')
    return
  }

  if (formData.password && !formData.current_password) {
    alert('비밀번호를 변경하려면 현재 비밀번호를 입력해주세요.')
    return
  }

  isLoading.value = true

  try {
    const result = await accountStore.updateProfile({
      name: formData.name,
      password: formData.password || undefined,
      current_password: formData.current_password || undefined,
      profile_image_url: formData.profile_image_url || undefined
    })

    if (result?.success) {
      alert('프로필이 성공적으로 업데이트되었습니다.')
      emit('close')
    } else {
      const errorMessage = result?.error || '프로필 업데이트에 실패했습니다.'
      alert(`오류: ${errorMessage}`)
    }
  } catch (error) {
    console.error('프로필 업데이트 오류:', error)
    alert('오류가 발생했습니다. 다시 시도해주세요.')
  } finally {
    isLoading.value = false
  }
}
</script>
