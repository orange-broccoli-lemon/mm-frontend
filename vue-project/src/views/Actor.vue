<template>
  <main class="bg-white dark:bg-gray-900 transition-colors duration-300">
    <!-- Actors Section -->
    <div class="py-4 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              인기 배우
            </h1>
          </div>
          <RouterLink
            v-if="actorStore.actorList.length > 5"
            :to="{ name: 'AllActors' }"
            class="group relative w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
          >
            <span class="text-blue-500 hover:text-blue-600 text-xl font-bold group-hover:rotate-90 transition-all duration-300">+</span>
            <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              더보기
            </div>
          </RouterLink>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <span class="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">인기 배우를 불러오는 중...</span>
        </div>
        
        <!-- Actors Grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          <ActorCard
            v-for="actor in actorStore.actorList.slice(0, 6)"
            :key="actor.person_id"
            :id="actor.person_id"
            :name="actor.name"
            :image="actor.profile_image_url"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useActorStore } from '@/stores/actor';
import ActorCard from '../components/ActorCard.vue';

const actorStore = useActorStore();
const isLoading = ref(true);

onMounted(async () => {
  try {
    await actorStore.allActors()
  } finally {
    isLoading.value = false
  }
})
</script>

