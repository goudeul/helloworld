import Router from '@koa/router'

const router = new Router()

router.post('/register', ctx => {   // 회원가입
  ctx.body = {
    code: 'S0001',
  }
})

router.post('/login', ctx => {      // 로그인
  ctx.body = {
    code: 'S0001',
  }
})

router.get('/me', ctx => {    // 본인정보 확인
  ctx.body = {
    code: 'S0001',
  }
})

router.put('/:id', ctx => {         // 패스워드 변경
  ctx.body = {
    code: 'S0001',
  }
})

router.delete('/:id', ctx => {      // 회원 삭제
  ctx.body = {
    code: 'S0001',
    data: {
      user: null,
    },
  }
})

module.exports = router
