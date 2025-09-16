<template>
  <div class="relative">
    <!-- Search Input -->
    <div class="relative">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        @focus="showDropdown = true"
        @blur="handleBlur"
        type="text"
        placeholder="영화, 인물, 사용자 검색..."
        class="w-64 px-4 py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-800 dark:focus:ring-gray-300 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
      </div>
      <div v-if="isLoading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
      </div>
    </div>

    <!-- Search Dropdown -->
    <div 
      v-if="showDropdown && (searchResults.movies.length > 0 || searchResults.actors.length > 0 || searchResults.users.length > 0 || searchQuery.length > 0 || isLoading)"
      class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      <!-- Search Results -->
      <div v-if="searchQuery.length > 0">
        <!-- Movies Section -->
        <div v-if="searchResults.movies.length > 0" class="p-3 border-b border-gray-100 dark:border-gray-700">
          <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">영화</h4>
          <div class="space-y-1">
            <div
              v-for="movie in searchResults.movies.slice(0, 3)"
              :key="movie.movie_id"
              @click="selectMovie(movie)"
              class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
            >
              <img 
                :src="movie.poster_url || '/src/assets/spotti.png'" 
                :alt="movie.title"
                class="w-8 h-12 object-cover rounded"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ movie.title }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">영화</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actors Section -->
        <div v-if="searchResults.actors.length > 0" class="p-3 border-b border-gray-100 dark:border-gray-700">
          <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            인물 ({{ searchResults.actors.length }}개)
          </h4>
          <div class="space-y-1">
            <div
              v-for="actor in searchResults.actors.slice(0, 3)"
              :key="actor.person_id"
              @click="selectActor(actor)"
              class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
            >
              <img 
                :src="actor.profile_image_url || '/src/assets/spotti.png'" 
                :alt="actor.name"
                class="w-8 h-8 object-cover rounded-full"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ actor.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">인물</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Section -->
        <div v-if="searchResults.users.length > 0" class="p-3">
          <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">사용자</h4>
          <div class="space-y-1">
            <div
              v-for="user in searchResults.users.slice(0, 3)"
              :key="user.user_id"
              @click="selectUser(user)"
              class="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
            >
              <img 
                :src="user.profile_image_url || '/src/assets/spotti.png'" 
                :alt="user.username"
                class="w-8 h-8 object-cover rounded-full"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ user.username }}</p>
                <p class="text-xs text-gray-500">사용자</p>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="searchResults.movies.length === 0 && searchResults.actors.length === 0 && searchResults.users.length === 0 && searchQuery.length > 0" class="p-4 text-center text-gray-500">
          <p class="text-sm">검색 결과가 없습니다</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div v-if="searchQuery.length === 0" class="p-3">
        <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">빠른 검색</h4>
        <div class="space-y-1">
          <div @click="goToSearchPage('movie')" class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-blue-600 text-sm">🎬</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">영화 검색</p>
              <p class="text-xs text-gray-500">인기 영화 찾기</p>
            </div>
          </div>
          <div @click="goToSearchPage('actor')" class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span class="text-green-600 text-sm">👤</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">인물 검색</p>
              <p class="text-xs text-gray-500">배우, 감독 찾기</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movie'
import { useActorStore } from '@/stores/actor'
import { useAccountStore } from '@/stores/user'

const router = useRouter()
const movieStore = useMovieStore()
const actorStore = useActorStore()
const accountStore = useAccountStore()

const searchQuery = ref('')
const showDropdown = ref(false)
const isLoading = ref(false)
const searchTimeout = ref<number | null>(null)

const searchResults = ref({
  movies: [] as any[],
  actors: [] as any[],
  users: [] as any[]
})

// 검색 실행
const handleSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  if (searchQuery.value.length < 2) {
    searchResults.value = { movies: [], actors: [], users: [] }
    return
  }

  searchTimeout.value = setTimeout(async () => {
    await performSearch()
  }, 300)
}

// 실제 검색 수행
const performSearch = async () => {
  if (searchQuery.value.length < 2) return

  isLoading.value = true
  try {
    // 병렬로 모든 검색 수행
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

// 영화 검색
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

// 인물 검색
const searchActors = async () => {
  try {
    console.log('SearchBar - 배우 검색 시작:', searchQuery.value)
    const results = await actorStore.searchActors(searchQuery.value)
    console.log('SearchBar - 배우 검색 결과:', results)
    searchResults.value.actors = results
    console.log('SearchBar - searchResults.actors 업데이트:', searchResults.value.actors)
  } catch (error) {
    console.error('SearchBar - 인물 검색 실패:', error)
    searchResults.value.actors = []
  }
}

// 사용자 검색
const searchUsers = async () => {
  try {
    // 사용자 검색 API가 있다면 사용, 없다면 빈 배열
    searchResults.value.users = []
  } catch (error) {
    console.error('사용자 검색 실패:', error)
    searchResults.value.users = []
  }
}

// 드롭다운 닫기 처리
const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

// 영화 선택
const selectMovie = (movie: any) => {
  router.push({ name: 'BookDetail', params: { id: movie.movie_id } })
  showDropdown.value = false
  searchQuery.value = ''
}

// 인물 선택
const selectActor = (actor: any) => {
  router.push({ name: 'ActorDetail', params: { id: actor.person_id } })
  showDropdown.value = false
  searchQuery.value = ''
}

// 사용자 선택
const selectUser = (user: any) => {
  // 사용자 프로필 페이지가 있다면 이동
  console.log('사용자 선택:', user)
  showDropdown.value = false
  searchQuery.value = ''
}

// 검색 페이지로 이동
const goToSearchPage = (type: string) => {
  router.push({ name: 'SearchResults', query: { type, q: searchQuery.value } })
  showDropdown.value = false
}

// 컴포넌트 마운트 시 배우 목록 미리 로드
onMounted(async () => {
  try {
    console.log('SearchBar - 배우 목록 미리 로드 시작')
    await actorStore.allActors()
    console.log('SearchBar - 배우 목록 로드 완료:', actorStore.actorList.length, '명')
  } catch (error) {
    console.error('SearchBar - 배우 목록 로드 실패:', error)
  }
})

// 검색어 변경 감지
watch(searchQuery, (newQuery) => {
  if (newQuery.length === 0) {
    searchResults.value = { movies: [], actors: [], users: [] }
  }
})
</script>
