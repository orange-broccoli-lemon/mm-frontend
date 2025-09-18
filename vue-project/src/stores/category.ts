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
  const BASE_API = `https://i13m105.p.ssafy.io/api/`
  const popularGenres = ref<Genre[]>([])
  const isPopularGenresLoaded = ref(false)
  
  const genreMovies = ref<{ [genreId: number]: Movie[] }>({})
  const genreMoviesLoading = ref<{ [genreId: number]: boolean }>({})

  const fetchPopularGenres = async function() {
    if (isPopularGenresLoaded.value && popularGenres.value.length > 0) return

    try {
      const res = await axios.get<Genre[]>(`${BASE_API}v1/genres/popular`)
      popularGenres.value = res.data ?? []
      isPopularGenresLoaded.value = true
    } catch (err) {
      const error = err as AxiosError
      console.error('인기 장르 불러오기 실패', error.response?.data || error.message)
      throw error
    }
  }

  const fetchMoviesByGenre = async function(genreId: number, page: number = 1) {
    if (!genreId || genreId <= 0) throw new Error('올바르지 않은 장르 ID입니다.')

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

  const getMoviesByGenre = (genreId: number): Movie[] => genreMovies.value[genreId] ?? []

  const isGenreMoviesLoading = (genreId: number): boolean => genreMoviesLoading.value[genreId] ?? false

  const getGenreById = (genreId: number): Genre | undefined =>
    popularGenres.value.find(genre => genre.genre_id === genreId)

  return { 
    BASE_API,
    popularGenres, 
    isPopularGenresLoaded, 
    fetchPopularGenres,
    fetchMoviesByGenre,
    getMoviesByGenre,
    isGenreMoviesLoading,
    getGenreById
  }
})
