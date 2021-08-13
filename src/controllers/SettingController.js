import SettingService from '../services/SettingService'
import moment from 'moment'

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
      let setting = await SettingService.read()

      if (!setting) {
        // ctx.throw(401, { message: '설정정보가 존재하지 않습니다.', ctx })
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        setting = {
          passwordPeriods: 0,
          updated_at: now
        }
      }

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
