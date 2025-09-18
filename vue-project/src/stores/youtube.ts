// src/services/youtubeService.ts
import axios from "axios"

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "YOUR_YOUTUBE_API_KEY"
const BASE_URL = "https://www.googleapis.com/youtube/v3/search"

// 캐시 TTL (1시간)
const CACHE_TTL = 1000 * 60 * 60

export interface YoutubeVideo {
  id: { videoId: string }
  snippet: {
    title: string
    description: string
    channelTitle: string
    thumbnails: { high: { url: string } }
  }
}

export const fetchYoutubeVideos = async (
  query: string,
  maxResults: number = 5
): Promise<YoutubeVideo[]> => {
  if (!API_KEY || API_KEY === "YOUR_YOUTUBE_API_KEY") {
    throw new Error("YouTube API 키가 설정되지 않았습니다.")
  }

  const cacheKey = `yt_${query}_${maxResults}`
  const cached = localStorage.getItem(cacheKey)

  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < CACHE_TTL) {
      console.log("✅ 캐시에서 불러옴:", query)
      return data
    }
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        part: "snippet",
        q: query,
        type: "video",
        maxResults,
        order: "relevance",
        key: API_KEY,
      },
    })

    const data = response.data.items || []

    // 캐싱 저장
    localStorage.setItem(
      cacheKey,
      JSON.stringify({ data, timestamp: Date.now() })
    )

    return data
  } catch (err: any) {
    console.error("YouTube API 오류:", err)
    if (err.response?.status === 403) {
      throw new Error("API 키가 유효하지 않거나 할당량이 초과되었습니다.")
    } else if (err.response?.status === 400) {
      throw new Error("잘못된 요청입니다. API 키를 확인해주세요.")
    } else {
      throw new Error("영상을 불러오는 중 오류가 발생했습니다.")
    }
  }
}
