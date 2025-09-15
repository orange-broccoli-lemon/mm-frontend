<template>
    <div>
        <h1>ACtor!!!!!!!!!</h1>
        <div class="actor-list-container">
          <div
            v-for="actor in actorStore.actorList.slice(0, 5)"
            :key="actor.id"
          >
              :id="actor.id"
              :name="actor.name"
              :image="actor.profile_url"
            />
          </div>
        </div>
        <div class="show-more-container" v-if="actorStore.actorList.length > 5">
            <RouterLink :to="{ name: 'AllActors' }" class="more-link">더보기</RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useActorStore } from '@/stores/actor';
import ActorCard from '../components/ActorCard.vue';

const actorStore = useActorStore();

onMounted(() => {
  actorStore.allActors();
});
</script>

<style scoped>
.actor-list-container {
  display: flex;
  overflow-x: auto; 
  gap: 20px;
  padding: 20px;

  -ms-overflow-style: none;  
  scrollbar-width: none; 
}

.actor-list-container::-webkit-scrollbar {
  display: none; 
}

.show-more-container {
  text-align: center;
  margin: 20px 0;
}

.more-link {
  display: inline-block;
  padding: 10px 25px;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  color: #333;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  transition: all 0.2s ease-in-out;
}

.more-link:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
}
</style>