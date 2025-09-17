<template>
  <main class="bg-white dark:bg-gray-900 transition-colors duration-300">
    <!-- Actors Section -->
    <div class="py-4 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <!-- <span class="text-2xl">🎭</span> -->
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              인기 배우
            </h1>
          </div>
          <RouterLink
            v-if="actorStore.actorList.length > 5"
            :to="{ name: 'AllActors' }"
            class="text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
          >
            <span class="text-lg font-medium">+</span>
          </RouterLink>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <span class="ml-2 text-gray-600 dark:text-gray-400">배우를 불러오는 중...</span>
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

