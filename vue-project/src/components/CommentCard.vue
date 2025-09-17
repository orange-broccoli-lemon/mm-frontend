<template>
  <div
    class="comment-card flex flex-col justify-start items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 w-56 h-64 overflow-hidden"
  >
    <div class="flex flex-col items-center gap-2 w-full">
      <img
        :src="profileImage || spottiImage"
        alt="프로필 이미지"
        class="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
      />
      <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ name }}</p>
      <hr class="w-full border-gray-200 dark:border-gray-700" />
    </div>

    <p
      ref="contentRef"
      class="comment-content text-left text-gray-800 dark:text-gray-200 break-words mt-2 overflow-hidden"
    >
      {{ content }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import fitty from 'fitty'
import spottiImage from '@/assets/spotti.png'

const props = defineProps<{
  profileImage: string
  content: string
  name: string
}>()

const contentRef = ref<HTMLElement>()

const applyFitty = () => {
  if (contentRef.value) {
    fitty(contentRef.value, {
      minSize: 12,
      maxSize: 18,
      multiLine: true
    })
  }
}

onMounted(applyFitty)
watch(() => props.content, applyFitty)
</script>

<style scoped>
.comment-content {
  width: 100%;
  line-height: 1.3;
  white-space: normal; 
  }
</style>
