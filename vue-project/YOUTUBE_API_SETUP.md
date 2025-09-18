# YouTube Data API v3 설정 가이드

## 1. Google Cloud Console에서 API 키 발급

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "라이브러리"로 이동
4. "YouTube Data API v3" 검색 후 활성화
5. "API 및 서비스" > "사용자 인증 정보"로 이동
6. "사용자 인증 정보 만들기" > "API 키" 선택
7. 생성된 API 키를 복사

## 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가:

```env
VITE_YOUTUBE_API_KEY=your_actual_api_key_here
```

## 3. API 키 보안 설정

Google Cloud Console에서 API 키의 제한사항을 설정하는 것을 권장합니다:

1. "API 및 서비스" > "사용자 인증 정보"에서 API 키 클릭
2. "애플리케이션 제한사항"에서 "HTTP 리퍼러" 선택
3. 도메인 추가 (예: `localhost:3000/*`, `yourdomain.com/*`)
4. "API 제한사항"에서 "YouTube Data API v3"만 선택

## 4. 할당량 확인

YouTube Data API v3는 일일 할당량이 있습니다:
- 기본 할당량: 10,000 단위/일
- 검색 요청: 100 단위/요청
- 따라서 하루에 약 100번의 검색이 가능합니다

## 5. 문제 해결

### API 키 오류
- API 키가 올바르게 설정되었는지 확인
- YouTube Data API v3가 활성화되었는지 확인
- 할당량이 초과되지 않았는지 확인

### CORS 오류
- 브라우저에서 직접 API를 호출하므로 CORS 문제는 없습니다
- 서버에서 프록시를 사용하는 경우 CORS 설정이 필요할 수 있습니다

## 6. 컴포넌트 사용법

```vue
<template>
  <YouTubeVideos />
</template>

<script setup>
import YouTubeVideos from '@/components/YouTubeVideos.vue'
</script>
```

컴포넌트는 자동으로 마운트 시 API를 호출하여 영화 관련 영상 5개를 가져옵니다.
