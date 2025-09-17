# --- 1단계: 빌드 환경 ---
# Node.js 윈도우 설치 버전(22.17.1)을 기반으로 빌드용 이미지 생성
# (builder 라는 별명 부여)
FROM node:22.19.0-alpine as builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json 파일들을 먼저 복사하여 의존성 설치 (캐시 활용)
COPY package*.json ./
RUN npm install

# 현재 폴더(vue_frontend)의 모든 소스 코드를 작업 디렉토리로 복사
COPY . .

# Vue 앱 빌드 실행
RUN npm run build

# --- 2단계: 서비스 환경 ---
# Nginx 서버를 기반으로 최종 서비스용 이미지 생성
FROM nginx:stable-alpine


# Nginx가 80번 포트를 사용하도록 설정
EXPOSE 80

# Nginx 서버 실행
CMD ["nginx", "-g", "daemon off;"]
