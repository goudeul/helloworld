# ELK 스택 Dockerize

### Elastic-search
1. 이미지 다운로드
~~~shell
docker pull elasticsearch:7.13.3
~~~

2. 실행
~~~shell
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.6.2
~~~

---



### filebeat
1. config 위치: ln -s /opt/homebrew/etc/filebeat
2. Setup
   filebeat setup -e
3. 실행
   brew services start elastic/tap/filebeat-full


todo 엘라스틱 서치 7.13 라이센스??
[보안문제?]https://www.elastic.co/guide/en/elasticsearch/reference/7.13/security-minimal-setup.html
다른 docker-compose.yml 확인할것
