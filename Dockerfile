# 사용할 Node.js의 버전을 지정합니다.
FROM node:17.4

# 앱 디렉토리 생성
WORKDIR /usr/src/app

# 앱 의존성 설치
# package.json 과 package-lock.json (if available)을 복사
COPY package*.json ./

RUN npm install
RUN npm install -g ts-node
# 프로덕션을 위한 코드를 실행하는 경우
# RUN npm ci --only=production

# 앱 소스 추가
COPY . .

# 앱이 사용할 포트를 지정합니다.
EXPOSE 10000

# 앱 실행
CMD [ "ts-node", "src/main.ts" ]
