<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header Section -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <div class="text-center animate-fade-in-down">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 animate-slide-in-left">
            모든 배우
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-lg animate-slide-in-right">
            인기 있는 배우들을 만나보세요
          </p>
        </div>
      </div>
    </div>

    <!-- Actors Grid Section -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        <div v-for="i in 12" :key="i" class="animate-pulse">
          <div class="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl mb-3"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
        </div>
      </div>

      <!-- Actors Grid -->
      <div v-else-if="actorStore.actorList.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        <div
          v-for="(actor, index) in actorStore.actorList"
          :key="actor.person_id"
          class="animate-fade-in-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <ActorCard
            :id="actor.person_id"
            :name="actor.name"
            :image="actor.profile_image_url"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 animate-fade-in">
        <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center animate-bounce-in">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 animate-slide-in-up">
          배우 정보가 없습니다
        </h3>
        <p class="text-gray-600 dark:text-gray-400 animate-slide-in-up" style="animation-delay: 0.2s;">
          잠시 후 다시 시도해주세요.
        </p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useActorStore } from '@/stores/actor';
import ActorCard from '@/components/ActorCard.vue';

const actorStore = useActorStore();

// 로딩 상태 계산
const isLoading = computed(() => !actorStore.isActorListLoaded && actorStore.actorList.length === 0);

onMounted(async () => {
  if (!actorStore.isActorListLoaded) {
    await actorStore.allActors();
  }
});
</script>

<style scoped>
/* Fade in from bottom animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fade in from top animation */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide in from left animation */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Slide in from right animation */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Slide in from bottom animation */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Bounce in animation */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Animation classes */
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out forwards;
  opacity: 0;
}

.animate-slide-in-left {
  animation: slideInLeft 0.8s ease-out forwards;
  opacity: 0;
}

.animate-slide-in-right {
  animation: slideInRight 0.8s ease-out forwards;
  opacity: 0;
  animation-delay: 0.2s;
}

.animate-slide-in-up {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
}

.animate-bounce-in {
  animation: bounceIn 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
  opacity: 0;
}
</style>
