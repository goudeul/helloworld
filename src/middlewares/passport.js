const passport = require('koa-passport')
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

import UserService from '../services/UserService'

// passport 로컬 Strategy(정책)
passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, async (email, password, done) => {
  const user = await UserService.findEmail(email)

  if (!user) return done('계정정보가 존재하지 않습니다.', false)
  if (!await bcrypt.compare(password, user.password)) return done('패스워드를 확인해주세요.', false)

  return done(null, user['dataValues'], '로그인에 성공했습니다.')
}))

// passport JWT Strategy(정책)
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}, async (payload, done) => {
  const user = await UserService.findEmail(payload.email)

  if (!user) return done('계정정보가 존재하지 않습니다.', false)

  return done(null, user['dataValues'], '로그인에 성공했습니다.')
}))

// bearerToken을 추출하여 ctx.user에 주입
export const authenticateJwt = async (ctx, done) => {
  await passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) {
      ctx.user = user
    }
  })(ctx, done)

  return done()
}
