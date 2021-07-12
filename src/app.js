import Koa from 'koa'
import Router from '@koa/router'
import KoaBody from 'koa-body'
import KoaCors from '@koa/cors'
import error from 'koa-json-error'
import KoaLogger from 'koa-logger'
import passport from 'koa-passport'
import { authenticateJwt } from './middlewares/passport'
import { apiRequest } from './middlewares/apiRequest'
import './config/env'

const app = new Koa()

// middleware
app.use(KoaCors())
app.use(KoaBody())
app.use(
  error((err) => {
    return {
      code: err.code || 'S9999',
      message: err.message
    }
  }),
)

// console
app.use(
  KoaLogger((str, args) => {
    console.log(str)
  }),
)

// authentication
app.use(passport.initialize())
app.use(authenticateJwt)
app.use(apiRequest)

// router
const router = new Router()
const api = require('./routes/v1')
router.use('/v1', api.routes())
app.use(router.routes()).use(router.allowedMethods())

// central error handler
app.on('error', (err) => {
  console.error('에러내용: ', err)
  // todo logging 파일 처리 필요
})

app.listen(process.env.PORT || 3000)
