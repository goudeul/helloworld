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
import UserController from './controllers/SeqUserController'
import './config/env'

const app = new Koa()

// authentication
app.use(passport.initialize())
app.use(authenticateJwt)

// middleware
app.use(KoaCors())
app.use(KoaBody())

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

Morgan.token('id', function getId() {
  return (context.user) ? context.user.id : undefined
})

app.use(
  Morgan(':remote-addr - :remote-user [:date[iso]] ' +
    ':method :url HTTP/:http-version :status :res[content-length] ' +
    ':referrer ":user-agent" :id', { stream: stream }),
)

// 에러처리
app.use(
  error((err) => {
    let message = {
      message: err.message,
      user: context.user,
    }
    if (err.ctx) {
      message = {
        ...message,
        ctx: err.ctx,
        request: err.ctx.request.body
      }
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

// sequelize db 연결
const { sequelize } = require('./models/index.js');
sequelize.sync().then(() => {
  console.log('DB connect success!!');

  UserController.check_and_create({
    id: 'admin',
    name: '어드민',
    password: 'coarsoft13@$',
    role: '00',
    phone: '010-0000-0000',
    identityNumber: null
  })

  UserController.check_and_create({
    id: 'professor_default',
    name: '교수자',
    password: 'coarsoft13@$',
    role: '10',
    phone: '010-0000-0000',
    identityNumber: null
  })

  UserController.check_and_create({
    id: 'student_default',
    name: '학습자',
    password: 'coarsoft13@$',
    role: '20',
    phone: '010-0000-0000',
    identityNumber: '100000'
  })
}).catch(err => {
  console.log('DB connect failed');
  console.log(err);
})

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
