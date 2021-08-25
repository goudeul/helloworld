import Router from '@koa/router'

import bo from './back-office'
import cls from './class'
import simulation from './simulation'
import stream from './stream'
import user from './user'
import logs from './logs'

const router = new Router()

router.use('/bo', bo.routes())
router.use('/class', cls.routes())
router.use('/simulation', simulation.routes())
router.use('/stream', stream.routes())
router.use('/user', user.routes())
router.use('/logs', logs.routes())

router.get('/', ctx => {
  ctx.body = {
    message: 'Api 서버 작동 확인용입니다.',
    path: ctx.request.path
  }
})

module.exports = router
