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

### production 서버 세팅시 확인할 것
- 일반계정으로 서버 실행하기 (80번 포트)
   - docker 처리로 가능한지 확인 요망
- pm2 클러스터 모드로 실행

---

### Dockerize
1. 이미지 생성
~~~shell
docker build . -t coarsoft/naval-academy-api
~~~
2. 실행
~~~shell
docker run -p 3000:3000 -d coarsoft/naval-academy-api
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
   
