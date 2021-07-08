import Router from '@koa/router'

const router = new Router()

router.get('/:id', ctx => {    // 시물레이션 상세
  ctx.body = {
    code: 'S0001',
  }
})

router.put('/:id', ctx => {    // 시물레이션 변경
  ctx.body = {
    code: 'S0001',
  }
})

module.exports = router
