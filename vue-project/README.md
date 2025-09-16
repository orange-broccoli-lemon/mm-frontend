# Movie Manager Frontend

Vue 3 + TypeScript + Vite로 구축된 영화 관리 프론트엔드 애플리케이션입니다.

## 주요 기능

- 사용자 인증 (이메일/비밀번호, Google OAuth)
- 영화 정보 조회 및 관리
- 커뮤니티 기능 (댓글, 스레드)
- 사용자 팔로우 시스템
- 배우 정보 조회

## 기술 스택

- Vue 3 (Composition API)
- TypeScript
- Vite
- Pinia (상태 관리)
- Vue Router
- Axios (HTTP 클라이언트)

## 개발 환경 설정

### 1. 의존성 설치

```sh
npm install
```

### 2. Google OAuth 설정

Google 로그인 기능을 사용하려면 Google Cloud Console에서 OAuth 2.0 클라이언트 ID를 생성해야 합니다.

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "사용자 인증 정보"로 이동
4. "사용자 인증 정보 만들기" > "OAuth 2.0 클라이언트 ID" 선택
5. 애플리케이션 유형: "웹 애플리케이션"
6. 승인된 JavaScript 원본: `http://localhost:5173` (개발용)

### 3. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Google OAuth 설정
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173

# API Base URL
VITE_API_BASE_URL=https://i13m105.p.ssafy.io/api/v1
```

### 4. 개발 서버 실행

```sh
npm run dev
```

## 빌드 및 배포

### 개발용 빌드

```sh
npm run dev
```

### 프로덕션 빌드

```sh
npm run build
```

### 타입 체크

```sh
npm run type-check
```

## API 엔드포인트

백엔드 API는 다음 엔드포인트를 사용합니다:

- **인증**: `https://i13m105.p.ssafy.io/api/v1/auth`
- **사용자**: `https://i13m105.p.ssafy.io/api/v1/users`
- **팔로우**: `https://i13m105.p.ssafy.io/api/v1/follows`

## Google 로그인 플로우

1. 사용자가 "Google 계정으로 로그인" 버튼 클릭
2. Google Identity Services를 통해 ID Token 획득
3. 백엔드 API (`/api/v1/auth/login/google`)로 ID Token 전송
4. 백엔드에서 Google ID Token 검증 후 JWT 토큰 발급
5. 프론트엔드에서 JWT 토큰 저장 및 사용자 정보 로드

## 문제 해결

### Google 로그인이 작동하지 않는 경우

1. Google Client ID가 올바르게 설정되었는지 확인
2. 도메인이 Google Cloud Console에 등록되었는지 확인
3. 브라우저 콘솔에서 오류 메시지 확인

### API 연결 문제

1. 백엔드 서버가 실행 중인지 확인
2. CORS 설정이 올바른지 확인
3. 네트워크 탭에서 API 요청 상태 확인

## 추천 IDE 설정

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vetur 비활성화)

## TypeScript 지원

`.vue` 파일의 TypeScript 지원을 위해 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 확장이 필요합니다.
