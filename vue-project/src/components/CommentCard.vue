<template>
  <div class="comment-card">
    <img :src="profileImage || spottiImage" alt="프로필 이미지" class="profile-img" />
    <p class="comment-content" ref="contentRef">{{ content }}</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import fitty from 'fitty'
import spottiImage from '@/assets/spotti.png'

const props = defineProps<{
  profileImage: string
  content: string
}>()

const contentRef = ref<HTMLElement>()

const applyFitty = () => {
  if (contentRef.value) {
    fitty(contentRef.value, {
      minSize: 10,
      maxSize: 18,
      multiLine: true 
    })
  }
}

onMounted(applyFitty)
watch(() => props.content, applyFitty)
</script>


<style scoped>
.comment-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;

  width: 12rem;
  height: 16rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  overflow: hidden; 
}

.profile-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.comment-content {
  width: 100%;
  text-align: center;
  color: #333;
  word-break: break-word;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
