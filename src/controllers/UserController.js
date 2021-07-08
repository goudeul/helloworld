import UserService from '../services/UserService'
import passport from 'koa-passport'
import jwt from 'jsonwebtoken'

function setBearerToken (user) {
  const secret = process.env.JWT_SECRET
  const payload = {
    id: user.id,
    email: user.email,
  }
  return jwt.sign(payload, secret, {
    expiresIn: '7d', // 7일
    issuer: 'coarsoft.com',
    subject: 'userInfo',
  })
}

module.exports = {
  create: async (ctx) => {
    const { id } = ctx.params
    const body = ctx.request.body
    const user = await UserService.create(body.user)

    ctx.body = {
      code: 'S0001',
      data: {
        user: user
      }
    }
  }
}
