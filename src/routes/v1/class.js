import Router from '@koa/router'

const router = new Router()

router.post('/', ctx => {         // 클래스 생성
  ctx.body = {
    code: 'S0001'
  }
})

router.post('/search', ctx => {   // 클래스 조회
  ctx.body = {
    code: 'S0001'
  }
})

router.post('/join', ctx => {     // 클래스 입장
  ctx.body = {
    code: 'S0001'
  }
})

router.post('/exit', ctx => {     // 클래스 퇴장
  ctx.body = {
    code: 'S0001'
  }
})

router.get('/:id', ctx => {   // 클래스 상세
  ctx.body = {
    code: 'S0001'
  }
})

router.delete('/:id', ctx => {       // 클래스 종료
  ctx.body = {
    code: 'S0001'
  }
})

module.exports = router
