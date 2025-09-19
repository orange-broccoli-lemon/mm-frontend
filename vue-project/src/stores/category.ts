import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'

export interface Genre {
  genre_id: number
  name: string
  movie_count: number
}

export interface Movie {
  movie_id: number
  title: string
  poster_url: string
  genre_ids: number[]
}

export interface GenreMoviesResponse {
  movies: Movie[]
  total: number
  page: number
  hasMore: boolean
}

export const useCategoryStore = defineStore('category', () => {
  /** API Base URL */
  const BASE_API = `https://i13m105.p.ssafy.io/api/`

  /** 장르 상태 */
  const allGenres = ref<Genre[]>([])
  const isAllGenresLoaded = ref(false)
  const isLoadingAllGenres = ref(false)

  const popularGenres = ref<Genre[]>([])
  const isPopularGenresLoaded = ref(false)
  const isLoadingPopularGenres = ref(false)

  /** 장르별 영화 상태 */
  const genreMovies = ref<{ [genreId: number]: Movie[] }>({})
  const genreMoviesLoading = ref<{ [genreId: number]: boolean }>({})

  // 스크롤 맨 위로 올리기
  const safeScrollTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  /** 전체 장르 조회 */
  const fetchAllGenres = async function() {
    if (isAllGenresLoaded.value && allGenres.value.length > 0) return
    if (isLoadingAllGenres.value) return

    isLoadingAllGenres.value = true
    try {
      const res = await axios.get<{ genres: Genre[] }>(`${BASE_API}v1/genres/`)
      allGenres.value = res.data.genres ?? []
      isAllGenresLoaded.value = true
    } catch (err) {
      const error = err as AxiosError
      console.error('전체 장르 불러오기 실패', error.response?.data || error.message)
      throw error
    } finally {
      isLoadingAllGenres.value = false
    }
  }

  /** 인기 장르 조회 */
  const fetchPopularGenres = async function() {
    if (isPopularGenresLoaded.value && popularGenres.value.length > 0) return
    if (isLoadingPopularGenres.value) return

    isLoadingPopularGenres.value = true
    try {
      const res = await axios.get<Genre[]>(`${BASE_API}v1/genres/popular`)
      popularGenres.value = res.data ?? []
      isPopularGenresLoaded.value = true
    } catch (err) {
      const error = err as AxiosError
      console.error('인기 장르 불러오기 실패', error.response?.data || error.message)
      throw error
    } finally {
      isLoadingPopularGenres.value = false
    }
  }

  /** 특정 장르 영화 조회 */
  const fetchMoviesByGenre = async function(genreId: number, page: number = 1) {
    if (!genreId || genreId <= 0) throw new Error('올바르지 않은 장르 ID입니다.')

    if (page === 1) safeScrollTop()

    try {
      genreMoviesLoading.value[genreId] = true
      const res = await axios.get<GenreMoviesResponse>(
        `${BASE_API}v1/genres/${genreId}/movies?page=${page}`
      )
      const responseData = res.data ?? { movies: [], total: 0, page: 1, hasMore: false }

      if (page === 1) {
        genreMovies.value[genreId] = responseData.movies
      } else {
        if (!genreMovies.value[genreId]) genreMovies.value[genreId] = []
        genreMovies.value[genreId].push(...responseData.movies)
      }

      return responseData
    } catch (err) {
      const error = err as AxiosError
      console.error(`장르 ${genreId} 영화 불러오기 실패`, error.response?.data || error.message)
      throw error
    } finally {
      genreMoviesLoading.value[genreId] = false
    }
  }

  /** 헬퍼 */
  const getMoviesByGenre = (genreId: number): Movie[] => genreMovies.value[genreId] ?? []
  const isGenreMoviesLoading = (genreId: number): boolean => genreMoviesLoading.value[genreId] ?? false
  const getGenreById = (genreId: number): Genre | undefined =>
    allGenres.value.find(g => g.genre_id === genreId) ||
    popularGenres.value.find(g => g.genre_id === genreId)

  return {
    BASE_API,
    allGenres,
    isAllGenresLoaded,
    isLoadingAllGenres,
    fetchAllGenres,
    popularGenres,
    isPopularGenresLoaded,
    isLoadingPopularGenres,
    fetchPopularGenres,
    fetchMoviesByGenre,
    getMoviesByGenre,
    isGenreMoviesLoading,
    getGenreById
  }
})
