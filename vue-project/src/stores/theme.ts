import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  // VueUse의 useDark를 사용하여 다크모드 상태 관리
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'theme-preference',
    storage: localStorage,
    auto: true, // 시스템 설정 자동 감지
  })

  // 디버깅: 다크모드 상태 변화 감지
  console.log('🎨 테마 스토어 초기화')
  console.log('🌙 초기 다크모드 상태:', isDark.value)
  console.log('📱 시스템 다크모드 설정:', window.matchMedia('(prefers-color-scheme: dark)').matches)
  console.log('💾 저장된 테마 설정:', localStorage.getItem('theme-preference'))

  // 다크모드 토글 함수
  const toggleDark = useToggle(isDark)

  // 현재 테마 상태 반환
  const getCurrentTheme = () => {
    return isDark.value ? 'dark' : 'light'
  }

  // 테마 설정 (수동)
  const setTheme = (theme: 'light' | 'dark') => {
    if (theme === 'dark') {
      isDark.value = true
    } else {
      isDark.value = false
    }
  }

  return {
    isDark,
    toggleDark,
    getCurrentTheme,
    setTheme,
  }
})
