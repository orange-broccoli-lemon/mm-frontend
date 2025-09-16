import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { AxiosError } from 'axios'


export interface ActorSummary {
  person_id: number
  name: string
  profile_image_url: string

}


export interface DetailActor {
  person_id: number;
  name: string;
  original_name: string;
  biography: string;
  birthday: string;
  deathday: string;
  place_of_birth: string;
  profile_image_url?: string;
  gender: number;
  known_for_department: string;
  popularity: number;
  is_adult: boolean;
  is_following: boolean;
  followers_count: number;
  created_at: string;
  updated_at: string;
}

export const useActorStore = defineStore('actor', () => {
    const BASE_API = `https://i13m105.p.ssafy.io/api/v1/persons`
    
    const actorDetails = ref<DetailActor | null>(null);

    const getActorDetail = async (person_id : number) => {
      try {
        const res = await axios.get<DetailActor>(`${BASE_API}/${person_id}`)
        actorDetails.value = res.data;
        return res.data;
      } catch(err) {
        const error = err as AxiosError
        console.error('상세페이지 불러오기 실패', error.response?.data || error.message) 
        actorDetails.value = null;
        return null   
      }
    }

    
    const actorList = ref<ActorSummary[]>([])
    const allActors = async function(){
      try {
        const res = await axios.get('https://i13m105.p.ssafy.io/api/v1/persons/');
        actorList.value = res.data;
      } catch (error) {
        console.error('Error fetching actors:', error);
      
      
      }
    }

    return { actorDetails, getActorDetail, allActors, actorList }
})