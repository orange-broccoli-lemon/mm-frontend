<template>
  <div class="actor-card">
    <img :src="image || 'https://placehold.co/150x150'" :alt="name" class="image" />
    <div class="title-text">
      <h2>{{ name }}</h2>
    </div>
  </div>
</template>


<script setup lang="ts">
defineProps<{
  id: number;
  name: string;
  image?: string;
}>();
</script>


<style scoped>
.actor-card {
  margin: 10px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.actor-card:hover {
  transform: scale(1.05);
}

.image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #eee;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.title-text h2 {
  margin-top: 10px;
  font-size: 1.2em;
  color: #333;
}
</style>
