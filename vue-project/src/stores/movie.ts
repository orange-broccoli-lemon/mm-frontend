import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'
import { useAccountStore } from '@/stores/user'

export interface MovieList {
  title: string
  poster_url: string
  movie_id: number
  backdrop_url: string
}

export interface DetailMovie {
  movie_id: number
  title: string
  original_title: string
  overview: string
  release_date: string
  runtime: number
  poster_url: string
  backdrop_url: string
  average_rating: number
  is_adult: boolean
  trailer_url: string
  create_at: string
  update_at: string
  is_liked: boolean
  is_in_watchlist: boolean
  concise_review : string
}

export interface MovieComment {
  comment_id: number
  movie_id: number
  user_id: number
  content: string
  rating: number // 1-9점 만점
  watched_date: string
  is_spoiler: boolean
  spoiler_confidence: string
  is_public: boolean
  likes_count: number
  is_liked: boolean
  create_at: string
  update_at: string
  user_name: string
  user_profile_image: string
}

export const useMovieStore = defineStore('counter', () => {
  const BASE_API = `https://i13m105.p.ssafy.io/api/`
  const movieList = ref<MovieList[]>([])
  const popularMovies = ref<MovieList[]>([])
  const isPopularMoviesLoaded = ref(false)
  const isLoadingPopularMovies = ref(false)

  const movie = ref<DetailMovie | null>(null)

  const userStore = useAccountStore()
  const detailMovie = async (moviePk: number) => {
    try {
      const res = await axios.get<DetailMovie>(`${BASE_API}/v1/movies/${moviePk}`,{
        headers: { Authorization: `Bearer ${userStore.token}`, Accept: "application/json" }
      })
      console.log(res.data)
      
      movie.value = res.data as DetailMovie
      return res.data ?? null

    } catch (err) {
      const error = err as AxiosError
      console.error('상세페이지 불러오기 실패', error.response?.data || error.message)
      return null
    }
  }

  const allMovies = function() {
    axios({
      url: `${BASE_API}/v1/movies/`,
      method: `GET`,
    })
      .then(res => {
        movieList.value = res.data
        console.log('API 응답 데이터:', res.data) // 데이터 확인을 위한 console.log
      })
      .catch(err => {
        console.log(err)
      })
  }

  const fetchPopularMovies = async function() {
    // 이미 로드된 데이터가 있으면 API 호출하지 않음
    if (isPopularMoviesLoaded.value && popularMovies.value.length > 0) {
      console.log('인기 영화 데이터가 이미 로드됨, API 호출 생략')
      return
    }

    // 이미 로딩 중이면 중복 호출 방지
    if (isLoadingPopularMovies.value) {
      console.log('인기 영화 로딩 중, 중복 호출 방지')
      return
    }

    isLoadingPopularMovies.value = true

    try {
      console.log('인기 영화 API 호출 시작...')
      const res = await axios.get<MovieList[]>(`${BASE_API}/v1/movies/popular`)
      popularMovies.value = res.data ?? []
      isPopularMoviesLoaded.value = true
      console.log('popular movies:', res.data)
      
      // 포스터 URL 디버깅
      if (res.data && res.data.length > 0) {
        console.log('=== API 응답 디버깅 ===')
        console.log('전체 응답 데이터:', res.data)
        console.log('첫 번째 영화 데이터:', res.data[0])
        console.log('첫 번째 영화 포스터 URL:', res.data[0].poster_url)
        console.log('포스터 URL 타입:', typeof res.data[0].poster_url)
        console.log('포스터 URL 길이:', res.data[0].poster_url?.length)
        console.log('첫 번째 영화의 모든 키:', Object.keys(res.data[0]))
        
        // 처음 3개 영화의 포스터 URL 확인
        res.data.slice(0, 3).forEach((movie, index) => {
          console.log(`영화 ${index + 1} 포스터 URL:`, movie.poster_url)
        })
        console.log('=======================')
      }
    } catch (err) {
      console.error('인기영화 불러오기 실패', err)
    } finally {
      isLoadingPopularMovies.value = false
    }
  }

  // 영화 댓글 가져오기 함수
  // 영화 댓글 가져오기 함수
const fetchMovieComments = async (movieId: number, includeSpoilers = false) => {
  try {
    console.log('영화 댓글 요청:', movieId, 'includeSpoilers:', includeSpoilers)
    
    const headers: any = { 'Accept': 'application/json' }
    const token = localStorage.getItem('token')
    if (token) headers['Authorization'] = `Bearer ${token}`

    const url = `${BASE_API}v1/movies/${movieId}/comments?include_spoilers=${includeSpoilers}`
    console.log('API 요청 URL:', url)
    const res = await axios.get<MovieComment[]>(url, { headers })
    console.log('영화 댓글 응답:', res.data)
    return res.data ?? []
  } catch (err) {
    const error = err as AxiosError
    console.error('영화 댓글 불러오기 실패', error.response?.data || error.message)
    return []
  }
}

  return { allMovies, movieList, detailMovie, popularMovies, fetchPopularMovies, fetchMovieComments, isPopularMoviesLoaded, isLoadingPopularMovies, movie}
})
