import Router from '@koa/router'

const router = new Router()

router.get('/user', (ctx, next) => {
  ctx.body = {
    message: 'hello',
    path: ctx.request.path,
    ctx
  }
})

module.exports = router
