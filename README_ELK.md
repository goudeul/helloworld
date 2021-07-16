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
