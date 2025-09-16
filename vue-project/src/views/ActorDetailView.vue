<template>
  <div v-if="store.actorDetails" class="actor-detail-container">
    <div class="main-content">
      <div class="actor-image">
        <img :src="store.actorDetails.profile_image_url" :alt="store.actorDetails.name" />
      </div>
      <div class="actor-info">
        <h1>{{ store.actorDetails.name }}</h1>
        <p><strong>Original Name:</strong> {{ store.actorDetails.original_name }}</p>
        <p><strong>Birthday:</strong> {{ store.actorDetails.birthday }}</p>
        <p v-if="store.actorDetails.deathday"><strong>Day of Death:</strong> {{ store.actorDetails.deathday }}</p>
        <p><strong>Place of Birth:</strong> {{ store.actorDetails.place_of_birth }}</p>
        <p><strong>Known For:</strong> {{ store.actorDetails.known_for_department }}</p>
        <p><strong>Popularity:</strong> {{ store.actorDetails.popularity.toFixed(2) }}</p>
        <div class="follow-section">
          <button @click="toggleFollow" :class="{ 'following': isFollowing }">
            {{ isFollowing ? 'Following' : 'Follow' }}
          </button>
          <p>{{ followersCount }} Followers</p>
        </div>
      </div>
    </div>
    <div class="biography-section">
      <h2>Biography</h2>
      <p>{{ store.actorDetails.biography }}</p>
    </div>
  </div>
  <div v-else class="loading">
    <p>Loading actor details...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useActorStore } from '@/stores/actor'

const route = useRoute()
const store = useActorStore()

const isFollowing = ref(false)
const followersCount = ref(0)

onMounted(async () => {
  const personId = Number(route.params.id)
  if (personId) {
    await store.getActorDetail(personId)
    if (store.actorDetails) {
      isFollowing.value = store.actorDetails.is_following
      followersCount.value = store.actorDetails.followers_count
    }
  }
})

const toggleFollow = () => {
  isFollowing.value = !isFollowing.value
  if (isFollowing.value) {
    followersCount.value++
  } else {
    followersCount.value--
  }
  // Here you would also make an API call to update the follow status on the backend
}
</script>

<style scoped>
.actor-detail-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333;
}

.main-content {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.actor-image img {
  width: 300px;
  height: 450px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.actor-info {
  flex: 1;
}

.actor-info h1 {
  margin-top: 0;
  font-size: 2.5rem;
}

.actor-info p {
  font-size: 1.1rem;
  line-height: 1.6;
}

.follow-section {
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.follow-section button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  background-color: #007bff;
  color: white;
}

.follow-section button.following {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
}

.follow-section p {
  font-size: 1rem;
  font-weight: bold;
  color: #555;
}

.biography-section {
  margin-top: 2rem;
}

.biography-section h2 {
  font-size: 1.8rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.biography-section p {
  font-size: 1.1rem;
  line-height: 1.8;
  text-align: justify;
}

.loading {
  text-align: center;
  padding: 4rem;
  font-size: 1.5rem;
}
</style>
