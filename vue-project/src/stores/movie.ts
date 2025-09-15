import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'


export interface MovieList {
  title: string
  image: string
}

export interface DetailMovie{ 
  movie_id: number 
  title: string 
  original_title:string 
  overview:string
  release_date:string
  runtime:number 
  poster_url:string 
  backdrop_url:string
  average_rating:number
  is_adult:boolean
  trailer_url:string
  create_at:string
  update_at:string
}

export const useMovieStore = defineStore('counter', () => {
    const BASE_API = `https://71db5011-85c7-41e0-ae29-b76270496dd7.mock.pstmn.io/movie/hot`
    const movieList = ref<MovieList[]>([])

    const detailMovie = async (moviePk: number) => {
    
      try
      {
        const res = await axios.get<DetailMovie>(`${BASE_API}/${moviePk}`)
        console.log(res.data)
        return res.data ?? null
      }
      catch(err)
      {
        const error = err as AxiosError
        console.error('상세페이지 불러오기 실패', error.response?.data || error.message) 
        return null   
      }

    }


    const allMovies = function(){
    axios({
      url:`${BASE_API}`,
      method:`GET`,
    })
      .then(res => {
        movieList.value = res.data
        console.log('API 응답 데이터:', res.data) // 데이터 확인을 위한 console.log
      })
      .catch(err => {
        console.log(err)
      })

  }

    return { allMovies , movieList, detailMovie }
})
