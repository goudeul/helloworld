import Koa from 'koa'
import Router from '@koa/router'
import KoaBody from 'koa-body'
import KoaCors from '@koa/cors'
import error from 'koa-json-error'
import KoaLogger from 'koa-logger'
import passport from 'koa-passport'
import { authenticateJwt } from './middlewares/passport'
import './config/env'

const app = new Koa()

// middleware
app.use(KoaCors())
app.use(KoaBody())
app.use(
  error((err) => {
    const data = {
      status: err.status || 500,
      code: err.code || 'S9999',
      message: err.message
    }
    return data
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

app.use(function(next) {
  next.throw(404, {code: 'S9999', message: '허용하지 않은 접근' })
});

app.listen(process.env.PORT || 3000)
