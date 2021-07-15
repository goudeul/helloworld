FROM node:16-alpine

# 앱 디렉터리 생성
WORKDIR /app

# 앱 의존성 설치
COPY package*.json ./

RUN npm install --silent
RUN npm i -g pm2 --silent

# 앱 소스 추가
COPY . .

CMD [ "npm", "start" ]
# CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
EXPOSE 3000

