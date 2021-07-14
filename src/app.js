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
      status: err.status || 500,
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

app.use(Morgan('combined', { stream }))

// router
const router = new Router()
const api = require('./routes/v1')

router.use('/v1', api.routes())
app.use(router.routes()).use(router.allowedMethods())

// central error handler
app.on('error', (err, ctx) => {
  // console.error('에러내용: ', err)
  console.log(ctx.user)
  // todo logging 파일 처리 필요
})

app.listen(process.env.PORT || 3000, () => {
  logger.log({
    level: 'info',
    message: `Listening on port ${process.env.PORT}...`
  })

  // console.log(ctx)
})
