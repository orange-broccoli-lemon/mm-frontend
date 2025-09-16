<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16">
    <div class="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center">
        <RouterLink to="/" class="flex items-center">
          <img src="@/assets/logo.png" alt="logo" class="w-8 h-8">
        </RouterLink>
      </div>

      <!-- Search Bar -->
      <div class="flex-1 max-w-md mx-8">
        <SearchBar />
      </div>
      
      <!-- Navigation Links -->
      <div class="flex items-center space-x-4">
        <!-- Theme Toggle Button -->
        <button
          @click="handleThemeToggle"
          class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          :title="themeStore.isDark ? '라이트 모드로 전환' : '다크 모드로 전환'"
        >
          <svg v-if="themeStore.isDark" class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </button>
        
        <div v-if="!accountStore.user" class="flex items-center space-x-3">
          <RouterLink 
            to="/signup" 
            class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            회원가입
          </RouterLink>
          <RouterLink 
            to="/login" 
            class="bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            로그인
          </RouterLink>
        </div>
        <div v-else class="flex items-center space-x-3">
          <RouterLink 
            to="/mypage" 
            class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            마이페이지
          </RouterLink>
          <button 
            @click="logOut"
            class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAccountStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import SearchBar from '@/components/SearchBar.vue'

const accountStore = useAccountStore()
const themeStore = useThemeStore()

const logOut = () => {
  accountStore.logOut()
}

const handleThemeToggle = () => {
  console.log('🔄 테마 토글 버튼 클릭')
  console.log('🌙 토글 전 다크모드 상태:', themeStore.isDark.value)
  console.log('📄 HTML 클래스 (토글 전):', document.documentElement.className)
  
  themeStore.toggleDark()
  
  // 토글 후 상태 확인 (약간의 지연 후)
  setTimeout(() => {
    console.log('🌙 토글 후 다크모드 상태:', themeStore.isDark.value)
    console.log('📄 HTML 클래스 (토글 후):', document.documentElement.className)
    console.log('💾 localStorage 테마 설정:', localStorage.getItem('theme-preference'))
  }, 100)
}
</script>
