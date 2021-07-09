import UserService from '../services/UserService'
import passport from 'koa-passport'
import jwt from 'jsonwebtoken'
const bcrypt = require('bcryptjs')

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
    try {
      const body = ctx.request.body
      const user = await UserService.create(body.user)

      ctx.body = {
        code: 'S0001',
        data: {
          user: user,
        },
      }
    } catch (e) {
      const user = ctx.user
      ctx.throw(404, e.message, { code: 'S9999', user })
    }
  },
  login: async (ctx, next) => {
    await passport.authenticate('local', {}, async (err, user) => {
      if (err) {
        const user = ctx.request.body.user
        ctx.throw(404, err, { code: 'S9999', user })
      } else {
        const bearerToken = setBearerToken(user)

        ctx.body = {
          code: 'S0001',
          data: {
            user,
            token: bearerToken,
          },
        }
      }
    })(ctx, next)
  },
  me: async (ctx, next) => {
    const user = ctx.user
    ctx.body = {
      code: 'S0001',
      data: {
        user
      }
    }
  },
  update: async (ctx) => {
    const id = ctx.params.id
    const body = ctx.request.body
    const user = await UserService.update(id, body.user)

    ctx.body = {
      code: 'S0001',
      data: {
        id,
        user
      }
    }
  },
  changePassword: async (ctx, next) => {
    const id = ctx.user.id
    const body = ctx.request.body
    const { password, new_password } = body.user
    const oldUser = await UserService.read(id)

    if (!await bcrypt.compareSync(password, oldUser.password)) {
      const user = ctx.user
      ctx.throw(404, '패스워드를 확인해주세요.', { code: 'S9999', user })
    }

    const user = await UserService.update(id, {
      password: new_password
    })

    ctx.body = {
      code: 'S0001',
      data: {
        user
      }
    }
  },
  delete: async (ctx) => {
    const id = ctx.params.id
    const user = await UserService.delete(id)
    if (!user) {
      const user = ctx.user
      ctx.throw(404, '회원정보가 존재하지 않습니다.', { code: 'S9999', user })
    }

    ctx.body = {
      code: 'S0001',
      data: {
        user: user
      }
    }
  },
}
