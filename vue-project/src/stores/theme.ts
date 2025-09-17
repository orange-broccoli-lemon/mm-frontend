import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  // auto 옵션 제거 (vueuse/core 최신 버전에서는 지원 안 함)
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'theme-preference',
    storage: localStorage,
    // auto: true 제거
  })

  // 디버깅
  console.log('🎨 테마 스토어 초기화')
  console.log('🌙 초기 다크모드 상태:', isDark.value)
  console.log('📱 시스템 다크모드 설정:', window.matchMedia('(prefers-color-scheme: dark)').matches)
  console.log('💾 저장된 테마 설정:', localStorage.getItem('theme-preference'))

  const toggleDark = useToggle(isDark) // ref<boolean>로 관리됨

  const getCurrentTheme = () => (isDark.value ? 'dark' : 'light')

  const setTheme = (theme: 'light' | 'dark') => {
    isDark.value = theme === 'dark'
  }

  return {
    isDark,
    toggleDark,
    getCurrentTheme,
    setTheme,
  }
})
