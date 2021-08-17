# Kubernetes naval-academy-api

## 의존 프레임웍
1. Elasticsearch
   - 로그 분석 도구 
2. Kibana
   - 로그 시각화 도구
3. Fluentd
   - 로그 수집 도구 
> [참조 URL](https://lahuman.github.io/kubernetes-logging/)


## 쿠버네티스 
1. Api Image 생성
~~~shell
cd naval-academy-api
docker build -t coarsoft/naval-academy-api:v1.0 .
~~~

2. 쿠버네티스 명령어
~~~shell
// 실행
kubectl apply -f ./kubernetes/naval-academy.yaml

// 중지
kubectl delete -f ./kubernetes/naval-academy.yaml

// 확인
kubectl get all

// 로그 확인
kubectl logs pod/naval-academy-84c59ff949-jt7g4

// 접속
kubectl exec -it pod/app-7f49f8c5b7-d8pzh -- sh
~~~

3. Api 정상 접속 확인
   - 웹 링크: [http://localhost:31000/v1](http://localhost:31000/v1)
