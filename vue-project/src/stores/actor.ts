import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'


export interface Actor {
  id: number
  name: string
  profile_url? : string

}

export const useActorStore = defineStore('actor', () => {
    const BASE_API = `https://71db5011-85c7-41e0-ae29-b76270496dd7.mock.pstmn.io/person`
    const actorList = ref<Actor[]>([])
    const allActors = async function(){
    // axios({
    //   url:`${BASE_API}`,
    //   method:`GET`,
    // })
    //   .then(res => {
    //     console.log('API 응답 데이터:', res.data) // 데이터 확인을 위한 console.log
    //     actorList.value = res.data
    //   })
    //   .catch(err => {
    //     console.error('API 오류:', err) // 에러 확인을 위한 console.error
    //   })
    try {
      const res = await axios({
        url: `${BASE_API}`,
        method: 'GET',
      });
      console.log('API 응답 데이터:', res.data);
      actorList.value = res.data;
    } catch (err) {
      console.error('API 오류:', err);
    }
  }

    return { allActors , actorList }
})