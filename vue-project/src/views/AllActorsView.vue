<template>
  <div>
    <h1>All Actors</h1>
    <div class="actor-grid-container">
      <ActorCard
        v-for="actor in actorStore.actorList"
                :key="actor.person_id"
        :id="actor.person_id"
        :name="actor.name"
        :image="actor.profile_image_url"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useActorStore } from '@/stores/actor';
import ActorCard from '@/components/ActorCard.vue';

const actorStore = useActorStore();

onMounted(() => {
  actorStore.allActors();
});
</script>

<style scoped>
.actor-grid-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 20px;
}

h1 {
  text-align: center;
  margin: 20px 0;
}
</style>