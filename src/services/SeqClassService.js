const { class: Classes } = require('../models')
const { Op } = require('sequelize')
const { filterSort } = require('../utils')
import moment from 'moment'
import uniqid from 'uniqid'

module.exports = {

  /**
   * @description 클래스 생성
   * @param {JSON} cls - 생성할 클래스 정보
   * @param {JSON} professor - 클래스를 생성한 교수님 정보
   * @returns {JSON} - 생성된 클래스 정보
   */
  async create(cls, professor) {
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    const id = uniqid()

    cls = {
      ...cls,
      id: id,
      // name: cls.name,
      lastApiRequest: now,
      professor: {
        id: professor.id,
        name: professor.name,
        role: professor.role,
      },
      students: [],
      created_at: now,
      updated_at: now,
    }
    await Classes.create(cls)

    return await Classes.findOne({ where: { id } })
  },

  /**
   * @description 클래스 정보 검색
   * @param {string} id - 클래스 아이디
   * @returns {JSON} - 검색한 클래스 정보
   */
  async read(id) {
    return await Classes.findOne({ where: { id } })
  },

  /**
   * @description 클래스 정보 수정
   * @param {string} id - 클래스 아이디
   * @param {class} cls - 클래스 구조체
   * @returns {JSON} - 클래스 정보
   */
  async update(id, cls) {
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    cls.updated_at = now

    await Classes.update(cls, { where: { id: id } })

    return await Classes.findOne({ where: { id } })
  },

  /**
   * @description 클래스 삭제
   * @param {string} id - 클래스 아이디
   * @returns {JSON} - 클래스 정보
   */
  async delete(id) {
    return await Classes.destroy({ where: { id } })
  },

  /**
   * @description 클래스 검색정보
   * @param {object} body - 컨텍스트
   * @returns {JSON} - 검색한 클래스 정보
   */
  async find(body) {
    const where = { [Op.and]: [] }
    if (body.filter) {
      filterSort.setFilter(where, body.filter || [], Classes)
    }

    const order = []
    if (body.sort) {
      filterSort.setSort(order, body.sort || [], Classes)
    }

    const { count, rows } = await Classes.findAndCountAll({
      where: where || null,
      order: order || null,
      offset: body.from || 0,
      limit: body.size || null,
      attributes: body.attributes || null,
      logging: body.logging || false,
    })

    if (count < 1) throw new Error('정보가 존재하지 않습니다.')

    return {
      total: count,
      rows,
    }
  },
}
