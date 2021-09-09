const passport = require('koa-passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
import crypter from '../utils/crypter'
import '../config/env'

import UserService from '../services/SeqUserService'

// passport 로컬 Strategy(정책)
passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[id]',
      passwordField: 'user[password]',
    },
    async (id, password, done) => {
      const user = await UserService.readForce(id)

      if (!user || !user.id) {
        return done(null, false, { message: '계정정보가 존재하지 않습니다.' })
      }
      if (user.isBlocked) {
        return done(null, false, { message: '로그인이 차단되었습니다.' })
      }
      if (!(await bcrypt.compareSync(password, user.password))) {
        return done(null, false, { message: '패스워드를 확인해주세요.', user: user })
      }

      delete user.password

      return done(null, true, { user: user }) //'로그인에 성공했습니다.'
    },
  ),
)

// passport JWT Strategy(정책)
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      const user = await UserService.read(payload.id)

      if (!user || !user.id) return done(null, false, { message: '계정정보가 존재하지 않습니다.' })

      // returnUser 객체의 패스워드를 지워서 반환해야함!! (user 객체에 대한 메모리 참조때문에)
      delete user.password

      return done(null, true, { user: user }) //'로그인에 성공했습니다.'
    },
  ),
)

// bearerToken을 추출하여 ctx.user에 주입
export const authenticateJwt = async (ctx, done) => {
  await passport.authenticate('jwt', { session: false }, (_null, result, { message, user }) => {
    if (user) {
      ctx.user = user
    }
  })(ctx, done)

  return done()
}
