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
    const body = ctx.request.body

    const checkPassword = true
    if (!checkPassword) ctx.throw(404, '패스워드를 확인해주세요.', { code: 'S9999' })

    const user = await UserService.create(body.user)
    if (!user) ctx.throw(404, '동일한 아이디가 이미 존재합니다.', { code: 'S9999' })

    ctx.body = {
      code: 'S0001',
      data: {
        user: user,
      },
    }
  },
  read: async (ctx) => {
    const { id } = ctx.params

    ctx.body = {
      code: 'S0001',
      data: {},
    }
  },
}
