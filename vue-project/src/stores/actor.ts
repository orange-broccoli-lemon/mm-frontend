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
  const error = ref<string | null>(null)
  
  const allActors = async function(){
    try {
      error.value = null
      const res = await axios.get(`${BASE_API}/`);
      actorList.value = res.data;
      console.log('배우 목록 로드 성공:', res.data.length, '명')
    } catch (err) {
      const axiosError = err as AxiosError
      console.error('Error fetching actors:', axiosError);
      
      if (axiosError.code === 'ERR_NETWORK' || axiosError.response?.status === 502) {
        error.value = '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.'
      } else if (axiosError.response?.status === 404) {
        error.value = '배우 정보를 찾을 수 없습니다.'
      } else {
        error.value = '배우 목록을 불러오는 중 오류가 발생했습니다.'
      }
      
      // 빈 배열로 초기화하여 이전 데이터가 남아있지 않도록 함
      actorList.value = []
    }
  }

  // 배우 검색 함수
  const searchActors = async (query: string) => {
    console.log('배우 검색 시작:', query)
    
    // 먼저 로컬 데이터에서 검색 시도
    try {
      // 이미 로드된 데이터가 있으면 사용, 없으면 새로 로드
      if (actorList.value.length === 0) {
        console.log('배우 목록이 비어있음, 전체 목록 로드 시도')
        await allActors();
      }
      
      // 로컬 데이터가 있으면 필터링
      if (actorList.value.length > 0) {
        const filtered = actorList.value.filter(actor =>
          actor.name.toLowerCase().includes(query.toLowerCase())
        );
        console.log('로컬 필터링 결과:', filtered)
        return filtered;
      }
    } catch (localError) {
      console.error('로컬 필터링 실패:', localError);
    }
    
    // 로컬 필터링이 실패하면 API 검색 시도
    try {
      console.log('API 검색 시도')
      const res = await axios.get(`${BASE_API}/search?q=${encodeURIComponent(query)}`);
      console.log('배우 검색 결과:', res.data)
      return res.data || [];
    } catch (error) {
      const axiosError = error as AxiosError
      console.error('API 검색 실패:', axiosError);
      
      // 422 오류는 검색 API가 지원하지 않는 형식
      if (axiosError.response?.status === 422) {
        console.log('검색 API가 해당 쿼리를 지원하지 않음')
      }
      
      // 모든 방법이 실패하면 빈 배열 반환
      console.log('모든 검색 방법 실패, 빈 결과 반환')
      return [];
    }
  }

  return { 
    actorDetails, 
    getActorDetail, 
    allActors, 
    actorList, 
    loading, 
    currentActorId,
    clearActorDetails,
    searchActors,
    error
  }
})