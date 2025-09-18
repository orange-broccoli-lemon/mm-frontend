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
  
  // 장르별 영화 데이터
  const genreMovies = ref<{ [genreId: number]: Movie[] }>({})
  const genreMoviesLoading = ref<{ [genreId: number]: boolean }>({})

  const fetchPopularGenres = async function() {
    // 이미 로드된 경우 API 다시 호출하지 않음
    if (isPopularGenresLoaded.value && popularGenres.value.length > 0) {
      console.log('인기 장르 데이터 이미 로드됨, API 호출 생략')
      return
    }

    try {
      console.log('인기 장르 API 호출 시작...')
      const res = await axios.get<Genre[]>(`${BASE_API}v1/genres/popular`)
      popularGenres.value = res.data ?? []
      isPopularGenresLoaded.value = true

      console.log('popular genres:', res.data)
    } catch (err) {
      const error = err as AxiosError
      console.error('인기 장르 불러오기 실패', error.response?.data || error.message)
      throw error
    }
  }

  const fetchMoviesByGenre = async function(genreId: number, page: number = 1) {
    try {
      genreMoviesLoading.value[genreId] = true
      console.log(`장르 ${genreId} 영화 API 호출 시작... (페이지: ${page})`)
      
      const res = await axios.get<GenreMoviesResponse>(
        `${BASE_API}v1/movies/genre/${genreId}?page=${page}`
      )
      
      const responseData = res.data ?? { movies: [], total: 0, page: 1, hasMore: false }
      
      if (page === 1) {
        // 첫 페이지인 경우 새로 설정
        genreMovies.value[genreId] = responseData.movies
      } else {
        // 추가 페이지인 경우 기존 데이터에 추가
        if (!genreMovies.value[genreId]) {
          genreMovies.value[genreId] = []
        }
        genreMovies.value[genreId].push(...responseData.movies)
      }

      console.log(`장르 ${genreId} 영화 로드 완료:`, responseData)
      return responseData
      
    } catch (err) {
      const error = err as AxiosError
      console.error(`장르 ${genreId} 영화 불러오기 실패`, error.response?.data || error.message)
      throw error
    } finally {
      genreMoviesLoading.value[genreId] = false
    }
  }

  // 특정 장르의 영화 목록 가져오기 (getter)
  const getMoviesByGenre = (genreId: number): Movie[] => {
    return genreMovies.value[genreId] ?? []
  }

  // 특정 장르의 로딩 상태 가져오기 (getter)
  const isGenreMoviesLoading = (genreId: number): boolean => {
    return genreMoviesLoading.value[genreId] ?? false
  }

  // 장르 정보 가져오기 (getter)
  const getGenreById = (genreId: number): Genre | undefined => {
    return popularGenres.value.find(genre => genre.genre_id === genreId)
  }

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