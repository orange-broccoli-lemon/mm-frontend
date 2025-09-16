<script setup lang="ts">
const props = defineProps<{
  profileImage: string
  user_name: string
  content: string
}>()

console.log('profileImage:', props.profileImage)
console.log('user_name:', props.user_name)
console.log('content:', props.content)
</script>

<template>
  <div class="comment-card">
    <div class="profile-row">
      <img :src="profileImage" alt="프로필" class="profile-img" />
      <span class="user-name">{{ user_name }}</span>
    </div>
    <p class="comment-content">{{ content }}</p>
  </div>
</template>

<style scoped>
.comment-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;

  width: 12rem;
  height: 16rem;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.5rem;
  overflow: visible; 
}

.profile-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem; 
}

.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: bold;
  color: #333;
  font-size: 1rem;
}

.comment-content {
  width: 100%;
  text-align: start;
  color: #333;
  word-break: break-word;
  line-height: 1.2;
}
</style>
