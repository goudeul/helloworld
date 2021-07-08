import Router from '@koa/router'
const router = new Router()

router.get('/', (ctx, next) => {
  ctx.body = {
    message: 'hello',
    path: ctx.request.path
  }
  next()
})

module.exports = router
