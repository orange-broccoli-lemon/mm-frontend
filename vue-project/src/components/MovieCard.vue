<script setup lang="ts">
defineProps<{
  title: string;
  image: string;
}>();
</script>

<template>
  
  <div class="movie-card">
    <img :src="image" :alt="title" class="image" />
    <div class="title-text">
      <h2>{{ title }}</h2>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  background: white;
  border-radius: 1rem; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 15rem; 
  transition: box-shadow 0.3s ease;
}

.image {
  width: 100%; 
  height: 10rem; 
  object-fit: cover; 
}

.title-text {
  padding: 1rem; 
}

</style>
