import UserService from '../services/UserService'
import passport from 'koa-passport'
import jwt from 'jsonwebtoken'
import moment from 'moment'

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
    const body = ctx.request.body
    try {
      const user = await UserService.create(body.user)

      ctx.body = {
        code: 'S0001',
        data: {
          user: user,
        },
      }
    } catch (e) {
      ctx.throw(404, e.message, { code: 'S9999', ctx })
    }
  },
  login: async (ctx, next) => {
    try {
      await passport.authenticate('local', {}, async (err, user) => {
        if (err) {
          ctx.throw(404, err, { code: 'S9999', ctx })
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
    } catch (e) {
      ctx.throw(404, e.message, { code: 'S9999', ctx })
    }
  },
  me: async (ctx, next) => {
    try {
      const user = ctx.user
      ctx.body = {
        code: 'S0001',
        data: {
          user,
        },
      }
    } catch (e) {
      ctx.throw(404, e.message, { code: 'S9999', ctx })
    }
  },
  update: async (ctx) => {
    try {
      const id = ctx.params.id
      const body = ctx.request.body

      const oldUser = await UserService.read(id)
      const password = (body.user.password) ? await UserService.createPassword(body.user.password) : null
      const now = moment().format('YYYY-MM-DD HH:mm:ss')

      const newUser = {
        ...oldUser,
        ...body.user,
        password: password || oldUser.password,
        updated_at: now,
      }

      const user = await UserService.update(id, newUser)

      ctx.body = {
        code: 'S0001',
        data: {
          id,
          user,
        },
      }
    } catch (e) {
      ctx.throw(404, e.message, { code: 'S9999', ctx })
    }
  },
  changePassword: async (ctx, next) => {
    try {
      const id = ctx.user.id
      const body = ctx.request.body
      const oldUser = await UserService.read(id)
      const password = (body.user.new_password) ? await UserService.createPassword(body.user.new_password) : null
      const now = moment().format('YYYY-MM-DD HH:mm:ss')

      if (!await bcrypt.compareSync(body.user.password, oldUser.password)) {
        ctx.throw(404, '패스워드를 확인해주세요.', { code: 'S9999', ctx })
      }

      const newUser = {
        ...oldUser,
        password: password || oldUser.password,
        lastModifyPassword:
          password ? now : oldUser.lastModifyPassword,
        updated_at: now,
      }

      const user = await UserService.update(id, newUser)

      ctx.body = {
        code: 'S0001',
        data: {
          user,
        },
      }
    } catch (e) {
      ctx.throw(404, e.message, { code: 'S9999', ctx })
    }
  },
  delete: async (ctx) => {
    try {
      const id = ctx.params.id
      const user = await UserService.delete(id)

      if (!user) {
        ctx.throw(404, '회원정보가 존재하지 않습니다.', { code: 'S9999', ctx })
      }

      ctx.body = {
        code: 'S0001',
        data: {
          user: null,
        },
      }
    } catch (e) {
      ctx.throw(404, e.message, { code: 'S9999', ctx })
    }
  },
}
