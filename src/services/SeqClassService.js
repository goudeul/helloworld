const { class: Classes } = require('../models')
const { Op } = require('sequelize')
const { filterSort } = require('../utils')
import moment from 'moment'
import uniqid from 'uniqid'

module.exports = {

  async create (cls, professor) {
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    const class_id = uniqid()

    cls = {
      ...cls,
      id: class_id,
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
    return await Classes.create(cls)
  },

  async read (id) {
    return await Classes.findOne({ where: { id } })
  },

  async update (id, cls) {
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    Classes.update_at = now

    return await Classes.update(cls, { where: { id } })
  },

  async delete (id) {
    return await Classes.destroy({ where: { id } })
  },

  async find (body) {
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
