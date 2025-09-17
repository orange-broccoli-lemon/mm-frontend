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
        
        <!-- Actors Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
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
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useActorStore } from '@/stores/actor';
import ActorCard from '../components/ActorCard.vue';

const actorStore = useActorStore();

onMounted(async () => {
  await actorStore.allActors()
})
</script>

