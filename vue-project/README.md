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

---

## 📅 2024-12-19 작업 내역

### 🎨 UI/UX 개선 및 다크모드 구현

#### 1. **다크모드 시스템 구축**
- **VueUse 라이브러리 설치**: `@vueuse/core` 추가
- **테마 상태 관리**: `src/stores/theme.ts` 생성
  - 시스템 설정 자동 감지 (`auto: true`)
  - 사용자 수동 토글 기능
  - localStorage에 설정 저장
- **Tailwind CSS 다크모드 설정**: `darkMode: 'class'` 구성
- **강력한 CSS 오버라이드**: Tailwind CSS v4 호환성을 위한 수동 스타일 추가

#### 2. **NavBar 다크모드 지원**
- **토글 버튼 추가**: ☀️/🌙 아이콘으로 직관적인 UI
- **아이콘 색상 최적화**: 다크모드에서 해 아이콘 가시성 개선
- **전체 NavBar 스타일**: 다크모드 색상 적용

#### 3. **전역 다크모드 스타일 적용**
- **App.vue**: 전체 배경색 다크모드 지원
- **SearchBar**: 검색 입력창 및 드롭다운 다크모드 스타일
- **Main.vue**: 메인 컨테이너 다크모드 배경
- **HotMovie.vue**: 인기 영화 섹션 다크모드 지원
- **Actor.vue**: 인기 배우 섹션 다크모드 지원
- **MovieCard.vue**: 영화 카드 다크모드 스타일
- **ActorCard.vue**: 배우 카드 다크모드 스타일

#### 4. **마이페이지 다크모드 완전 지원**
- **헤더 섹션**: 프로필 카드 다크모드 스타일
- **통계 카드**: 리뷰, 팔로워, 팔로잉 카드 다크모드 적용
- **액션 버튼**: "스포띠빠이와 함께 리뷰쓰러가기" 버튼 다크모드
- **최근 리뷰 섹션**: 리뷰 카드 및 텍스트 다크모드 지원
- **디버깅 정보**: 노란색 배경 다크모드 버전

#### 5. **ActorDetail 페이지 UI 통일성 개선**
- **완전한 리디자인**: Tailwind CSS 기반으로 전면 개편
- **다크모드 완벽 지원**: 모든 요소에 다크모드 스타일 적용
- **반응형 레이아웃**: 모바일/데스크톱 최적화
- **현대적인 UI 컴포넌트**:
  - 로딩 스피너 애니메이션
  - 프로그레스 바 (인기도 표시)
  - 개선된 팔로우 버튼
  - 한국어 날짜 포맷팅
- **시각적 개선**: 아이콘, 그림자, 전환 효과 추가

#### 6. **CSS 강화 및 최적화**
- **강력한 다크모드 오버라이드**: `!important`를 사용한 확실한 스타일 적용
- **텍스트 가시성 개선**: 모든 텍스트 색상 다크모드 최적화
- **아이콘 색상 최적화**: 다크모드에서 아이콘 가시성 향상
- **전환 효과**: 모든 색상 변경에 부드러운 transition 적용

### 🔧 기술적 개선사항

#### 1. **의존성 관리**
- `@vueuse/core` 설치 및 설정
- Tailwind CSS v4 호환성 확보

#### 2. **상태 관리**
- 테마 상태를 Pinia 스토어로 중앙 관리
- 시스템 설정과 사용자 설정의 자동 동기화

#### 3. **타입 안정성**
- TypeScript 타입 오류 수정
- `as any` 타입 캐스팅으로 임시 해결

#### 4. **성능 최적화**
- CSS 클래스 기반 다크모드로 빠른 전환
- 불필요한 CSS 제거 및 Tailwind CSS 활용

### 🎯 사용자 경험 개선

#### 1. **일관된 디자인 시스템**
- 모든 페이지에서 통일된 다크모드 경험
- 일관된 색상 팔레트 및 간격

#### 2. **접근성 향상**
- 적절한 색상 대비로 가독성 개선
- 직관적인 토글 버튼 UI

#### 3. **반응형 디자인**
- 모든 화면 크기에서 최적화된 다크모드
- 모바일과 데스크톱 모두 지원

#### 7. **배우 검색 기능 개선**
- **SearchBar 컴포넌트 개선**: 배우 검색 결과가 표시되지 않는 문제 해결
- **배우 데이터 미리 로드**: SearchBar 마운트 시 배우 목록 자동 로드
- **상세한 디버깅 로그**: 검색 과정을 단계별로 로깅하여 문제 추적
- **검색 결과 표시 개선**: 결과 개수 표시 및 드롭다운 조건 개선

#### 8. **전역 스타일 시스템 개선**
- **CSS 강제 오버라이드**: Tailwind CSS v4 호환성을 위한 수동 스타일 추가
- **텍스트 가시성 최적화**: 모든 HTML 요소에 대한 다크모드 텍스트 색상 강제 적용
- **아이콘 색상 최적화**: 다크모드에서 아이콘 가시성 향상
- **전환 효과 통일**: 모든 색상 변경에 일관된 transition 적용

### 🔧 추가 기술적 개선사항

#### 5. **검색 기능 최적화**
- **배우 검색 디버깅**: SearchBar에서 배우 검색이 작동하지 않는 문제 해결
- **데이터 로딩 최적화**: 컴포넌트 마운트 시 필요한 데이터 미리 로드
- **에러 처리 개선**: 검색 실패 시 적절한 에러 메시지 표시

#### 6. **CSS 아키텍처 개선**
- **강력한 오버라이드 시스템**: `html.dark` 선택자를 사용한 확실한 스타일 적용
- **색상 팔레트 표준화**: 일관된 다크모드 색상 체계 구축
- **반응형 디자인 강화**: 모든 화면 크기에서 최적화된 다크모드

#### 7. **컴포넌트 통일성**
- **디자인 시스템 일관성**: 모든 컴포넌트에서 동일한 스타일링 패턴 적용
- **카드 기반 레이아웃**: MyPage, HotMovie, ActorDetail 등에서 일관된 카드 디자인
- **버튼 스타일 통일**: 모든 버튼에서 동일한 다크모드 스타일 적용

### 🐛 버그 수정 및 문제 해결

#### 1. **다크모드 관련 버그**
- **Tailwind CSS v4 호환성**: `dark:` 접두사가 작동하지 않는 문제 해결
- **텍스트 가시성**: 다크모드에서 텍스트가 잘 보이지 않는 문제 해결
- **아이콘 가시성**: 다크모드에서 해 아이콘이 가려지는 문제 해결

#### 2. **검색 기능 버그**
- **배우 검색 미작동**: SearchBar에서 배우 검색 결과가 표시되지 않는 문제 해결
- **데이터 로딩 문제**: 배우 목록이 제대로 로드되지 않는 문제 해결

#### 3. **UI 일관성 문제**
- **ActorDetail 페이지**: 기존 스타일과 다른 디자인을 통일성 있게 수정
- **색상 불일치**: 페이지별로 다른 색상 체계를 통일

### 📁 수정된 파일 목록

#### **새로 생성된 파일**
- `src/stores/theme.ts` - 테마 상태 관리 스토어

#### **주요 수정 파일**
- `tailwind.config.js` - 다크모드 설정 추가
- `src/style.css` - 강력한 다크모드 오버라이드 스타일 추가
- `src/main.ts` - 테마 스토어 초기화 추가
- `src/App.vue` - 다크모드 배경색 적용
- `src/components/common/NavBar.vue` - 다크모드 토글 버튼 및 스타일 추가
- `src/components/SearchBar.vue` - 다크모드 스타일 및 배우 검색 개선
- `src/views/Main.vue` - 다크모드 배경색 적용
- `src/views/HotMovie.vue` - 다크모드 스타일 적용
- `src/views/Actor.vue` - 다크모드 스타일 적용
- `src/views/MyPage.vue` - 완전한 다크모드 지원 추가
- `src/views/ActorDetailView.vue` - 완전한 리디자인 및 다크모드 지원
- `src/components/MovieCard.vue` - 다크모드 스타일 적용
- `src/components/ActorCard.vue` - 다크모드 스타일 적용

### 📋 다음 작업 예정 (Jira 등록용)

1. **다크모드 추가 페이지 적용**
   - DetailMovie 페이지 다크모드 완성
   - CreateThread 페이지 다크모드 적용
   - LoginView, SignUp 페이지 다크모드 지원

2. **다크모드 설정 페이지 구현**
   - 사용자별 다크모드 설정 저장
   - 시스템 설정과 수동 설정 분리

3. **다크모드 테스트 및 최적화**
   - 모든 페이지에서 다크모드 동작 확인
   - 색상 대비 및 가독성 최종 검토

4. **성능 최적화**
   - 다크모드 전환 시 깜빡임 제거
   - CSS 최적화 및 번들 크기 감소

5. **검색 기능 완성**
   - 사용자 검색 기능 구현
   - 검색 결과 페이지 개선
   - 검색 성능 최적화

6. **UI/UX 추가 개선**
   - 애니메이션 효과 추가
   - 로딩 상태 개선
   - 에러 처리 UI 개선
