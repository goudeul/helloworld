import UserService from '../services/SeqUserService'
import SettingService from '../services/SettingService'
import passport from 'koa-passport'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import crypter from '../utils/crypter'

const bcrypt = require('bcryptjs')

/**
 * @description bearer 토큰을 생성함
 * @param {string} user - 토큰을 생성할 로그인 사용자정보
 * @returns {string} - 토큰값 반환
 */
function setBearerToken(user) {
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

  /**
   * @description  회원 로그인
   * @param {object} ctx - 컨텍스트
   * @param {object} next - 다음 미들웨어 전달용 함수
   */
  login: async (ctx, next) => {
    await passport.authenticate('local', {}, async (_null, result, { message, user }) => {
      const setting = await SettingService.read()

      if (!result) {
        if (user && process.env.passwordFailCount > 0) {
          // 로그인실패일때 실패횟수체크
          user.failLoginCount += 1
          if (user.failLoginCount >= process.env.passwordFailCount) {
            user.isBlocked = true
          }
          user = await UserService.update(user.id, user.dataValues)
        }
        ctx.throw(404, { message, ctx })
      } else {
        // 암호변경 만료일 체크
        let isModify = false
        const expday = moment(user.lastModifyPassword).add(setting.passwordPeriods, 'M')
        const isExpired = moment().isAfter(expday)
        if (isExpired) {
          user.modifyPasswordYN = 'Y'
          isModify = true
        }
        if (user.failLoginCount > 0) {
          user.failLoginCount = 0
          isModify = true
        }
        if (isModify) {
          user = await UserService.update(user.id, user.dataValues)
        }
        if (user) user = crypter.decrypt_user(user)

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

  /**
   * @description  회원 본인정보
   * @param {object} ctx - 컨텍스트
   * @param {object} next - 다음 미들웨어 전달용 함수
   */
  me: async (ctx, next) => {
    try {
      let user = ctx.user
      if (!user) {
        ctx.throw(404, {
          code: 'S9001',
          message: '본인정보 확인에 실패했습니다.',
          ctx,
        })
      }

      user = crypter.decrypt_user(user)

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

  /**
   * @description  회원 검색
   * @param {object} ctx - 컨텍스트
   */
  search: async (ctx) => {
    const body = ctx.request.body

    if (body.user) body.user = crypter.encrypt_user(body.user)

    let user = await UserService.find(body)

    if (user) user = crypter.decrypt_user(user)

    ctx.body = {
      code: 'S0001',
      data: {
        total: user.total,
        user: user,
      },
    }
  },

  /**
   * @description  회원 비밀번호 변경
   * @param {object} ctx - 컨텍스트
   * @param {object} next - 다음 미들웨어 전달용 함수
   */
  changePassword: async (ctx, next) => {
    try {
      const id = ctx.params.id
      let user = ctx.request.body.user

      if (user.password !== null && user.password !== '' && user.password === user.new_password) {
        ctx.throw(403, { message: '변경하려는 패스워드가 기존과 같습니다.', ctx })
      }
      const oldUser = await UserService.readForce(id)
      if (!(await bcrypt.compareSync(user.password, oldUser.password))) {
        ctx.throw(403, { message: '패스워드를 확인 해 주세요.', ctx })
      }
      const password = user.new_password
        ? await UserService.createPassword(user.new_password)
        : null
      user.password = password

      if (user) user = crypter.encrypt_user(user)

      let user2 = await UserService.update(id, user)
      if (user2 < 1) ctx.throw(409, '수정에 실패 했습니다.')
      if (user2) user2 = crypter.decrypt_user(user2)

      ctx.body = {
        code: 'S0001',
        data: {
          user: user2
        }
      }
    } catch (e) {
      ctx.throw(403, { message: e.message, ctx })
    }
  },

  /**
   * 최초 DB생성시 특정 회원이 없으면 생성함.
   * 생성회원 : admin, professor_default, student_default
   *
   * @param {JSON} user - 생성할 회원정보
   */
  check_and_create: async (user) => {
    const id = user.id

    const oldUser = await UserService.readForce(id)
    if (oldUser) return //해당회원이 있으면 중단함

    if (user) user = crypter.encrypt_user(user)

    await UserService.create(user)
    console.log('회원 자동생성 =', id)
  },

  //-------------------
  // CRUD
  //-------------------

  /**
   * @description  회원 로그인
   * @param {object} ctx - 컨텍스트
   */
  create: async (ctx) => {
    const body = ctx.request.body

    if (body.user) body.user = crypter.encrypt_user(body.user)

    let user = await UserService.create(body.user)
    if (!user) ctx.throw(500, { message: '정보 생성에 실패 했습니다.' }, ctx)

    if (user) user = crypter.decrypt_user(user)
    ctx.body = {
      code: 'S0001',
      data: {
        user: user,
      },
    }
  },

  /**
   * @description  회원 정보 변경
   * @param {object} ctx - 컨텍스트
   */
  update: async (ctx) => {
    try {
      const id = ctx.params.id
      const body = ctx.request.body

      if (body.user) body.user = crypter.encrypt_user(body.user)

      const result = await UserService.update(id, body.user)
      if (result < 1) ctx.throw(409, '수정에 실패 했습니다.')

      let user = await UserService.read(id)

      if (user) user = crypter.decrypt_user(user)

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

  /**
   * @description  회원 삭제
   * @param {object} ctx - 컨텍스트
   */
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
