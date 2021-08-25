import UserService from '../services/SeqUserService'
import SettingService from '../services/SettingService'
import passport from 'koa-passport'
import jwt from 'jsonwebtoken'
import moment from 'moment'

const table = 'user'
const bcrypt = require('bcryptjs')

function setBearerToken (user) {
  const secret = process.env.JWT_SECRET
  const payload = {
    id: user.id,  //아이디
    identityNumber: user.identityNumber,  //학번
  }
  return jwt.sign(payload, secret, {
    expiresIn: '7d', // 7일
    // expiresIn: "10000ms", // 10초
    issuer: 'coarsoft.com',
    subject: 'userInfo',
  })
}

module.exports = {

  login: async (ctx, next) => {
    try {
      await passport.authenticate('local', {}, async (error, user) => {
        if (error || !user) {
          ctx.throw(404, { message: '로그인에 실패했습니다. ' + error, ctx })
        } else {
          // 암호변경 만료일 체크
          let modifyPasswordYN = 'N'
          const setting = await SettingService.read()
          if (setting && setting.passwordPeriods) {
            const expday = moment(user.lastModifyPassword).add(setting.passwordPeriods, 'M')
            const isExpired = moment().isAfter(expday)
            if (isExpired) modifyPasswordYN = 'Y'
          }
          if (user) {
            user.modifyPasswordYN = modifyPasswordYN
          }
          // 암호변경 만료일 체크 //

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
      ctx.throw(404, { message: e.message, ctx })
    }
  },
  me: async (ctx, next) => {
    try {
      const user = ctx.user
      if (!user) {
        ctx.throw(404, {
          code: 'S9001',
          message: '본인정보 확인에 실패했습니다.',
          ctx,
        })
      }
      ctx.body = {
        code: 'S0001',
        data: {
          user,
        },
      }
    } catch (e) {
      ctx.throw(404, { code: e.code, message: e.message, ctx })
    }
  },

  changePassword: async (ctx, next) => {
    try {
      const id = ctx.params.id
      const body = ctx.request.body

      const oldUser = await UserService.read(id)
      if (!(await bcrypt.compareSync(body.user.password, oldUser.password))) {
        ctx.throw(403, { message: '패스워드를 확인해주세요.', ctx })
      }

      const password = body.user.new_password
        ? await UserService.createPassword(body.user.new_password)
        : null
      body.user.password = password

      const user = await UserService.update(id, body.user)
      if (user < 1) ctx.throw(409, '수정에 실패 했습니다.')

      ctx.body = {
        code: 'S0001',
        data: {
          user,
        },
      }
    } catch (e) {
      ctx.throw(403, { message: e.message, ctx })
    }
  },

  //-------------------
  // CRUD
  //-------------------

  create: async (ctx) => {
    const body = ctx.request.body
    const user = await UserService.create(body.user)
    if (!user) ctx.throw(500, { message: '정보 생성에 실패 했습니다.' }, ctx)

    ctx.body = {
      code: 'S0001',
      data: {
        user: user,
      },
    }
  },

  update: async (ctx) => {
    try {
      const id = ctx.params.id
      const body = ctx.request.body

      const result = await UserService.update(id, body.user)
      if (result < 1) ctx.throw(409, '수정에 실패 했습니다.')

      const user = await UserService.read(id)
      ctx.body = { code: 'S0001', [table]: user }

      ctx.body = {
        code: 'S0001',
        data: {
          id,
          user,
        },
      }
    } catch (e) {
      ctx.throw(404, { message: e.message, ctx })
    }
  },

  delete: async (ctx) => {
    try {
      const id = ctx.params.id
      const user = await UserService.delete(id)

      if (!user) {
        ctx.throw(401, { message: '회원정보가 존재하지 않습니다.', ctx })
      }

      ctx.body = {
        code: 'S0001',
        data: {
          user: null,
        },
      }
    } catch (e) {
      ctx.throw(401, { message: e.message, ctx })
    }
  },
}
