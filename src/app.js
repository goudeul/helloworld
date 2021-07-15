import Koa from 'koa'
import Router from '@koa/router'
import KoaBody from 'koa-body'
import KoaCors from '@koa/cors'
import error from 'koa-json-error'
import KoaLogger from 'koa-logger'
import { logger, stream } from './middlewares/winston'
import Morgan from 'koa-morgan'
import passport from 'koa-passport'
import { authenticateJwt } from './middlewares/passport'
import { apiRequest } from './middlewares/apiRequest'
import './config/env'

const app = new Koa()

// authentication
app.use(passport.initialize())
app.use(authenticateJwt)
app.use(apiRequest)

// middleware
app.use(KoaCors())
app.use(KoaBody())

app.use(
  error((err) => {
    const data = {
      code: err.code || 'S9999',
      message: err.message,
    }
    return data
  }),
)

// logging console
app.use(
  KoaLogger((str, args) => {
    console.log(str)
  }),
)

// Morgan으로 기록할 데이터 정의
let context = {}
app.use((ctx, next) => {
  context = ctx
  return next()
})

Morgan.token('id', function getId () {
  return (context.user) ? context.user.id : null
})

app.use(
  Morgan('::remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":id"',
    { stream: stream }),
)

// 에러처리
app.use(
  error((err) => {
    console.log(err.ctx.user)
    const message = {
      message: err.message,
      ctx: err.ctx,
      user: context.user,
    }
    logger.log({
      level: 'error',
      message: JSON.stringify(message),
    })

    return {
      code: err.code || 'S9999',
      message: err.message,
    }
  }),
)

// router
const router = new Router()
const api = require('./routes/v1')

router.use('/v1', api.routes())
app.use(router.routes()).use(router.allowedMethods())

// central error handler, 동작하지 않음, app.use(err(...)) 에서 처되됨
// app.on('error', (err, ctx) => {
//   // console.error('에러내용: ', err)
//   console.log(ctx.user)
//   // todo logging 파일 처리 필요
// })

app.use(function (next) {
  next.throw(404, { message: '허용하지 않은 접근' })
})

app.listen(process.env.PORT || 3000, () => {
  logger.log({
    level: 'info',
    message: `Listening on port ${process.env.PORT}...`,
  })
})
