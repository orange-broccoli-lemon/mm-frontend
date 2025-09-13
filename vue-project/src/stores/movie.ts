import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'


export interface Movie {
  title: string
  image: string
}

export const useMovieStore = defineStore('counter', () => {
    const BASE_API = `https://71db5011-85c7-41e0-ae29-b76270496dd7.mock.pstmn.io/movie/hot`
    const movieList = ref<Movie[]>([])
    const allMovies = function(){
    axios({
      url:`${BASE_API}`,
      method:`GET`,
    })
      .then(res => {
        movieList.value = res.data
      })
      .catch(err => {
        console.log(err)
      })

  }

    return { allMovies , movieList }
})
