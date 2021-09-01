import SettingService from '../services/SettingService'

module.exports = {

  /**
   * @description  백오피스 환경설정값 저장
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 환경설정값 저장결과
   */
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

  /**
   * @description  백오피스 환경설정값 읽기
   * @param {object} ctx - 컨텍스트
   * @param {object} next - 다음 미들웨어 전달용 함수
   * @returns {JSON} - 환경설정값
   */
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
