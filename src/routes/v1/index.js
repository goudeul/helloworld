import Router from '@koa/router'

import user from './user'
import cls from './class'
import simulation from './simulation'
import stream from './stream'

const router = new Router()

router.use('/user', user.routes())
router.use('/class', cls.routes())
router.use('/simulation', simulation.routes())

router.use('/stream', stream.routes())

router.get('/', ctx => {
  ctx.body = {
    message: 'Api 서버 작동 확인용입니다.',
    path: ctx.request.path
  }
})

module.exports = router
