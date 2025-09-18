<template>
  <div class="main-container bg-white dark:bg-gray-900 transition-colors duration-300">
    <HotMovie />
    <Actor />
    <Category />

    <button
      class="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-lg flex items-center justify-center bg-white dark:bg-gray-800 hover:scale-105 transition-transform duration-200"
      @click="showBotModal = true"
    >
      <img src="@/assets/spotti.png" alt="Spotti" class="w-10 h-10 object-contain" />
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

const showBotModal = ref(false)
</script>

<style scoped>
.main-container > * + * {
  margin-top: 0;
}
</style>
