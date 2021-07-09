import Koa from 'koa'
import Router from '@koa/router'
import KoaBody from 'koa-body'
import KoaCors from '@koa/cors'
import error from 'koa-json-error'
import KoaLogger from 'koa-logger'
import passport from 'koa-passport'
// import session from 'koa-session'
import { authenticateJwt } from './middlewares/passport'
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

// session
/*const CONFIG = {
  key: '48room.sess' /!** (string) cookie key (default is koa.sess) *!/,
  /!** (number || 'session') maxAge in ms (default is 1 days) *!/
  /!** 'session' will result in a cookie that expires when session/browser is closed *!/
  /!** Warning: If a session cookie is stolen, this cookie will never expire *!/
  maxAge: 86400000,
  autoCommit: true /!** (boolean) automatically commit headers (default true) *!/,
  overwrite: true /!** (boolean) can overwrite or not (default true) *!/,
  httpOnly: true /!** (boolean) httpOnly or not (default true) *!/,
  signed: false /!** (boolean) signed or not (default true) *!/,
  rolling: false /!** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) *!/,
  renew: false /!** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*!/,
  secure: false /!** (boolean) secure cookie*!/,
  sameSite:
    null /!** (string) session cookie sameSite options (default null, don't set it) *!/,
}
app.keys = ['coarsoft']
app.use(session(CONFIG, app))*/

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

app.listen(process.env.PORT || 3000)
