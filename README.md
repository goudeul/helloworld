# naval-academy-api

[![CircleCI](https://circleci.com/gh/coarzip/wallar-api.svg?style=shield&circle-token=4656714052ab2d455cda8275a730bb5f8edd0f89)](https://app.circleci.com/pipelines/github/coarzip/wallar-api/2/workflows/145caa96-0bc1-41d1-9053-4a2eaf6e918f)

### 개발환경

1. Node version
   - nvm 0.35.1
   - node 16
   - npm 7
2. 프레임워크
   - koajs
3. testing
   - jest
   - supertest

### 설치방법
1. 기본설정 (1회만)
   - github 계정 정책 변경 [참고](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)
   - github 계정 캐쉬 삭제 [참고](https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git)
~~~shell script
// nvm 설치
$ sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
$ source ~/.bashrc
$ nvm install 16

$ sudo -su $USER
$ git config --global credential.helper store             // git 계정정보 저장 (1회 저장후 지속됨)
$ git clone https://github.com/coarzip/naval-academy-api && cd naval-academy-api
~~~

2. git pull / build
~~~shell script
$ npm install

$ npm run start         // Production
$ npm run staging       // Staging (Dev 서버)
$ npm run test          // Test
$ npm run dev           // Dev Watch
~~~

3. 80번 포트 Binding
- 확인중
~~~shell
$ iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
~~~

### PM2 세팅
1. ecosystem.config.js 처리
2. package.json: babel plugin 추가
   - [참조](https://stackoverflow.com/questions/48637156/how-to-use-babel-node-with-pm2)
   ~~~json
   {
      "babel": {
         "presets": [
            "@babel/preset-env"
         ],
         "plugins": ["@babel/plugin-transform-runtime"]
      }
   }
   ~~~
3. babel-node 사용을 위한 설정
   - [참조](https://jaeseokim.tistory.com/115)
   - [참조](https://pm2.keymetrics.io/docs/tutorials/using-transpilers-with-pm2)
   - server-register.js 생성
   > 주의: app.js 와 동일 경로에 존재해야함
4. pm2 start (정상작동 확인 용도)
   ~~~shell
   npx pm2 start ecosystem.config.js --env development   // dev
   npx pm2 start ecosystem.config.js --env production    // prod
   ~~~
5. pm2를 활용한 무중단 서비스 (이부분은 적용 안함)
   - [참조](https://engineering.linecorp.com/ko/blog/pm2-nodejs/)
---

### Dockerize
1. 이미지 생성
~~~bash
docker build . -t coarsoft/naval-academy-api
~~~
2. 실행
   - 개발환경
   ~~~bash
   docker run -d -p 3000:3000 -v $PWD:/app coarsoft/naval-academy-api
   ~~~
   - 프로덕션
   ~~~bash
   docker run -d -p 3000:3000 coarsoft/naval-academy-api
   ~~~

### 로그기록 저장
1. 접속 일시
2. 계정정보의 변경 정보 및 일시
3. 사용자 로그인 정보 (성공/실패)
4. 사용자 작업의 성공/실패 여부
5. 로그인 시도횟수 초과시 접근차단 정보 (사용자 ID, PC 또는 접근 포트의 차단정보/원인 등)
6. 사용자가 전산 자료에 접근시
   - 일시, 사용자, 파일명, 건수(크기) 작업형태 등

---   
   
### 로그기록 보관/백업/보호
1. 1년 이상 보관
2. 별도 시스템 또는 저장매체 (주1회 이상) 백업
3. 
   
