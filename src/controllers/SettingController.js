import SettingService from '../services/SettingService'

module.exports = {
  write: async (ctx) => {
    try {
      const body = ctx.request.body

      const setting = await SettingService.write(body.setting)

      if (!setting) ctx.throw(500, { message: '정보 저장에 실패 했습니다.' }, ctx)

      ctx.body = {
        code: 'S0001',
        data: {
          setting: setting,
        },
      }
    } catch (e) {
      ctx.throw(404, { message: e.message, ctx })
    }
  },
  read: async (ctx, next) => {
    try {
      const setting = await SettingService.read()

      ctx.body = {
        code: 'S0001',
        data: {
          setting: setting,
        },
      }
    } catch (e) {
      ctx.throw(401, { message: e.message, ctx })
    }
  },
}
