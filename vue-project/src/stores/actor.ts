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
  const loading = ref(false);
  const currentActorId = ref<number | null>(null); // 현재 로드된 배우 ID 추적

  const getActorDetail = async (person_id : number) => {
    if (loading.value) return null; // 이미 요청 중이면 막기
    
    // 다른 배우로 변경될 때 이전 데이터 초기화
    if (currentActorId.value !== person_id) {
      actorDetails.value = null;
    }
    
    loading.value = true;
    currentActorId.value = person_id;
    
    try {
      const res = await axios.get<DetailActor>(`${BASE_API}/${person_id}`)
      actorDetails.value = res.data;
      return res.data;
    } catch(err) {
      const error = err as AxiosError
      console.error('상세페이지 불러오기 실패', error.response?.data || error.message) 
      actorDetails.value = null;
      return null   
    } finally {
      loading.value = false;
    }
  }

  const clearActorDetails = () => {
    actorDetails.value = null;
    currentActorId.value = null;
    loading.value = false;
  }

  const actorList = ref<ActorSummary[]>([])
  const allActors = async function(){
    try {
      const res = await axios.get(`${BASE_API}/`);
      actorList.value = res.data;
    } catch (error) {
      console.error('Error fetching actors:', error);
    }
  }

  return { 
    actorDetails, 
    getActorDetail, 
    allActors, 
    actorList, 
    loading, 
    currentActorId,
    clearActorDetails 
  }
})