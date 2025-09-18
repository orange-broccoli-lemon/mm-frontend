<template>
  <div class="skeleton-loader">
    <!-- Movie Card Skeleton -->
    <div v-if="type === 'movie-card'" class="movie-card-skeleton">
      <div class="skeleton-poster"></div>
      <div class="skeleton-content">
        <div class="skeleton-title"></div>
        <div class="skeleton-subtitle"></div>
      </div>
    </div>

    <!-- Grid Skeleton -->
    <div v-else-if="type === 'grid'" class="grid-skeleton">
      <div 
        v-for="n in count" 
        :key="n" 
        class="movie-card-skeleton skeleton-card"
        :style="{ animationDelay: `${(n - 1) * 100}ms` }"
      >
        <div class="skeleton-poster"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-subtitle"></div>
        </div>
      </div>
    </div>

    <!-- Carousel Skeleton -->
    <div v-else-if="type === 'carousel'" class="carousel-skeleton">
      <div class="carousel-track-skeleton">
        <div 
          v-for="n in count" 
          :key="n" 
          class="carousel-item-skeleton"
          :class="{
            'left-tilt': n === 1,
            'right-tilt': n === count
          }"
        >
          <div class="skeleton-backdrop"></div>
          <div class="skeleton-title"></div>
        </div>
      </div>
      <div class="carousel-indicators-skeleton">
        <div 
          v-for="n in Math.max(count - 2, 1)" 
          :key="n" 
          class="skeleton-dot"
        ></div>
      </div>
    </div>

    <!-- Text Skeleton -->
    <div v-else-if="type === 'text'" class="text-skeleton">
      <div 
        v-for="n in count" 
        :key="n" 
        class="skeleton-line"
        :style="{ width: n === count ? '60%' : '100%' }"
      ></div>
    </div>

    <!-- Default Rectangle Skeleton -->
    <div v-else class="skeleton-rectangle" :style="{ width, height }"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'movie-card' | 'grid' | 'carousel' | 'text' | 'rectangle'
  count?: number
  width?: string
  height?: string
}

withDefaults(defineProps<Props>(), {
  type: 'rectangle',
  count: 1,
  width: '100%',
  height: '20px'
})
</script>

<style scoped>
.skeleton-loader {
  width: 100%;
}

/* Base skeleton animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.skeleton-base {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.dark .skeleton-base {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200px 100%;
}

/* Movie Card Skeleton */
.movie-card-skeleton {
  transition: transform 0.2s ease-in-out;
}

/* Skeleton Card Entrance Animation */
.skeleton-card {
  opacity: 0;
  transform: translateY(20px);
  animation: skeletonSlideIn 0.5s ease-out forwards;
}

@keyframes skeletonSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skeleton-poster {
  width: 100%;
  height: 16rem; /* h-64 equivalent */
  background: #e5e7eb; /* bg-gray-200 */
  border-radius: 0.5rem; /* rounded-lg */
  margin-bottom: 0.75rem; /* mb-3 */
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
}

.dark .skeleton-poster {
  background: #374151; /* dark:bg-gray-700 */
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200px 100%;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* space-y-2 */
}

.skeleton-title {
  height: 1rem; /* h-4 */
  background: #e5e7eb; /* bg-gray-200 */
  border-radius: 0.25rem; /* rounded */
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
}

.skeleton-subtitle {
  height: 0.75rem; /* h-3 */
  background: #e5e7eb; /* bg-gray-200 */
  border-radius: 0.25rem; /* rounded */
  width: 75%; /* w-3/4 */
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
}

.dark .skeleton-title,
.dark .skeleton-subtitle {
  background: #374151; /* dark:bg-gray-700 */
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200px 100%;
}

/* Grid Skeleton */
.grid-skeleton {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem; /* gap-4 */
}

@media (min-width: 640px) {
  .grid-skeleton {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .grid-skeleton {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .grid-skeleton {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

/* Carousel Skeleton */
.carousel-skeleton {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.carousel-track-skeleton {
  display: flex;
  gap: 0.625rem; /* gap-2.5 */
  width: 100%;
  max-width: 80rem; /* max-w-7xl */
  margin-left: auto;
  margin-right: auto;
}

.carousel-item-skeleton {
  flex: 1;
  text-align: center;
}

.skeleton-backdrop {
  width: 100%;
  height: 24rem; /* h-96 */
  background: #e5e7eb; /* bg-gray-200 */
  border-radius: 1rem; /* rounded-2xl */
  margin-bottom: 0.5rem; /* mb-2 */
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
}

.dark .skeleton-backdrop {
  background: #374151; /* dark:bg-gray-700 */
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200px 100%;
}

.left-tilt {
  transform: perspective(800px) rotateY(20deg);
}

.right-tilt {
  transform: perspective(800px) rotateY(-20deg);
}

.carousel-indicators-skeleton {
  display: flex;
  justify-content: center;
  margin-top: 1rem; /* mt-4 */
  gap: 0.25rem; /* gap-1 */
}

.skeleton-dot {
  width: 0.875rem; /* w-3.5 */
  height: 0.875rem; /* h-3.5 */
  background: #e5e7eb; /* bg-gray-200 */
  border-radius: 50%; /* rounded-full */
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
}

.dark .skeleton-dot {
  background: #374151; /* dark:bg-gray-700 */
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200px 100%;
}

/* Text Skeleton */
.text-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* space-y-2 */
}

.skeleton-line {
  height: 1rem; /* h-4 */
  background: #e5e7eb; /* bg-gray-200 */
  border-radius: 0.25rem; /* rounded */
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
}

.dark .skeleton-line {
  background: #374151; /* dark:bg-gray-700 */
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200px 100%;
}

/* Rectangle Skeleton */
.skeleton-rectangle {
  background: #e5e7eb; /* bg-gray-200 */
  border-radius: 0.25rem; /* rounded */
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
}

.dark .skeleton-rectangle {
  background: #374151; /* dark:bg-gray-700 */
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200px 100%;
}
</style>
