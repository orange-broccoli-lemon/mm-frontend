<template>
  <div class="min-h-screen bg-white pt-16">
    <!-- Header Section -->
    <div class="bg-gray-50 py-8 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center gap-3 mb-4">
          <button @click="goBack" class="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200">
            <svg class="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 class="text-2xl font-semibold text-gray-900">
            "{{ searchQuery }}" 검색 결과
          </h1>
        </div>
        <p class="text-gray-600">영화, 인물, 사용자를 검색했습니다</p>
      </div>
    </div>

    <!-- Search Tabs -->
    <div class="py-6 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="flex space-x-1 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
              activeTab === tab.id
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ tab.label }} ({{ getTabCount(tab.id) }})
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          <span class="ml-3 text-gray-600">검색 중...</span>
        </div>

        <!-- Search Results -->
        <div v-else>
          <!-- Movies Tab -->
          <div v-if="activeTab === 'movies'" class="space-y-6">
            <div v-if="searchResults.movies.length > 0">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div
                  v-for="movie in searchResults.movies"
                  :key="movie.movie_id"
                  @click="goToMovie(movie)"
                  class="group cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div class="aspect-[2/3] overflow-hidden">
                      <img
                        :src="movie.poster_url || '/src/assets/spotti.png'"
                        :alt="movie.title"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div class="p-3">
                      <h3 class="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                        {{ movie.title }}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <div class="text-4xl mb-4">🎬</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">영화 검색 결과가 없습니다</h3>
              <p class="text-gray-600">다른 검색어로 시도해보세요</p>
            </div>
          </div>

          <!-- Actors Tab -->
          <div v-if="activeTab === 'actors'" class="space-y-6">
            <div v-if="searchResults.actors.length > 0">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div
                  v-for="actor in searchResults.actors"
                  :key="actor.person_id"
                  @click="goToActor(actor)"
                  class="group cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                    <img
                      :src="actor.profile_image_url || '/src/assets/spotti.png'"
                      :alt="actor.name"
                      class="w-16 h-16 object-cover rounded-full mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                    />
                    <h3 class="text-sm font-medium text-gray-900 truncate">
                      {{ actor.name }}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <div class="text-4xl mb-4">👤</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">인물 검색 결과가 없습니다</h3>
              <p class="text-gray-600">다른 검색어로 시도해보세요</p>
            </div>
          </div>

          <!-- Users Tab -->
          <div v-if="activeTab === 'users'" class="space-y-6">
            <div v-if="searchResults.users.length > 0">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div
                  v-for="user in searchResults.users"
                  :key="user.user_id"
                  @click="goToUser(user)"
                  class="group cursor-pointer transition-all duration-200 hover:scale-105"
                >
                  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div class="flex items-center gap-3">
                      <img
                        :src="user.profile_image_url || '/src/assets/spotti.png'"
                        :alt="user.username"
                        class="w-12 h-12 object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                      />
                      <div class="flex-1 min-w-0">
                        <h3 class="text-sm font-medium text-gray-900 truncate">
                          {{ user.username }}
                        </h3>
                        <p class="text-xs text-gray-500 truncate">
                          {{ user.email }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <div class="text-4xl mb-4">👥</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">사용자 검색 결과가 없습니다</h3>
              <p class="text-gray-600">다른 검색어로 시도해보세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movie'
import { useActorStore } from '@/stores/actor'

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()
const actorStore = useActorStore()

const searchQuery = ref(route.query.q as string || '')
const activeTab = ref(route.query.type as string || 'movies')
const isLoading = ref(false)

const searchResults = ref({
  movies: [] as any[],
  actors: [] as any[],
  users: [] as any[]
})

const tabs = [
  { id: 'movies', label: '영화' },
  { id: 'actors', label: '인물' },
  { id: 'users', label: '사용자' }
]

const getTabCount = (tabId: string) => {
  switch (tabId) {
    case 'movies':
      return searchResults.value.movies.length
    case 'actors':
      return searchResults.value.actors.length
    case 'users':
      return searchResults.value.users.length
    default:
      return 0
  }
}

const performSearch = async () => {
  if (!searchQuery.value) return

  isLoading.value = true
  try {
    await Promise.all([
      searchMovies(),
      searchActors(),
      searchUsers()
    ])
  } catch (error) {
    console.error('검색 중 오류 발생:', error)
  } finally {
    isLoading.value = false
  }
}

const searchMovies = async () => {
  try {
    await movieStore.fetchPopularMovies()
    const filtered = movieStore.popularMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    searchResults.value.movies = filtered
  } catch (error) {
    console.error('영화 검색 실패:', error)
    searchResults.value.movies = []
  }
}

const searchActors = async () => {
  try {
    const results = await actorStore.searchActors(searchQuery.value)
    searchResults.value.actors = results
  } catch (error) {
    console.error('인물 검색 실패:', error)
    searchResults.value.actors = []
  }
}

const searchUsers = async () => {
  try {
    // 사용자 검색 API가 있다면 사용
    searchResults.value.users = []
  } catch (error) {
    console.error('사용자 검색 실패:', error)
    searchResults.value.users = []
  }
}

const goBack = () => {
  router.back()
}

const goToMovie = (movie: any) => {
  router.push({ name: 'BookDetail', params: { id: movie.movie_id } })
}

const goToActor = (actor: any) => {
  router.push({ name: 'ActorDetail', params: { id: actor.person_id } })
}

const goToUser = (user: any) => {
  // 사용자 프로필 페이지가 있다면 이동
  console.log('사용자 프로필로 이동:', user)
}

onMounted(() => {
  performSearch()
})
</script>
