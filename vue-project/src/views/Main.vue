<template>
  <div class="main-container bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="main-section" style="animation-delay: 0ms;">
      <HotMovie />
    </div>
    <div class="main-section" style="animation-delay: 200ms;">
      <Actor />
    </div>
    <div class="main-section" style="animation-delay: 400ms;">
      <Category />
    </div>
    <div class="main-section" style="animation-delay: 600ms;">
      <YouTubeVideos />
    </div>

    <button
      class="group fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 hover:-translate-y-2 z-50"
      @click="toggleBotModal"
    >
      <img src="@/assets/spotti.png" alt="Spotti" class="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
      <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
        {{ showBotModal ? '챗봇 닫기' : 'Spotti와 채팅하기' }}
        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>

    <ChatBotModal :is-open="showBotModal" @close="showBotModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HotMovie from '@/views/HotMovie.vue'
import Actor from '@/views/Actor.vue'
import Category from '@/views/Category.vue'
import ChatBotModal from '@/views/ChatBotModal.vue'
import YouTubeVideos from '@/components/YouTubeVideos.vue' 

const showBotModal = ref(false)

const toggleBotModal = () => {
  showBotModal.value = !showBotModal.value
}
</script>

<style scoped>
.main-container > * + * {
  margin-top: 0;
}

/* Main Section Entrance Animation */
.main-section {
  opacity: 0;
  transform: translateY(40px);
  animation: sectionSlideIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes sectionSlideIn {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Staggered animation delays for main sections */
.main-section:nth-child(1) {
  animation-delay: 0ms;
}

.main-section:nth-child(2) {
  animation-delay: 200ms;
}

.main-section:nth-child(3) {
  animation-delay: 400ms;
}

.main-section:nth-child(4) {
  animation-delay: 600ms;
}
</style>
