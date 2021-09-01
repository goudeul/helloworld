import {
  fetchList,
  fetchListAll,
} from '../services/esService'

const table = 'logstash-naval-academy-info-*'

module.exports = {

  /**
   * @description 사용자 검색
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 사용자리스트
   */
  getList: async (ctx) => {
    const { filters, search, from, size, sort } = ctx.request.body

    const item = await fetchList({ table, filters, search, from, size, sort })
    if (!item) ctx.throw(404, 'data not found')

    ctx.body = {
      code: 'S0001',
      data: item.body,
    }
  },

  /**
   * @description 사용자 전체리스트, 페이징 추가됨
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 사용자리스트
   */
  getListAll: async (ctx) => {
    const { from, size } = ctx.request.body

    const result = await fetchListAll({ table, from, size })
    if (!result) ctx.throw(404, 'data not found')

    ctx.body = {
      code: 'S0001',
      data: result.body,
    }
  },

}
