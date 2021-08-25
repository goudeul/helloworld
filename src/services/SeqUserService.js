const { user: Users } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
import moment from 'moment'

const { filterSort } = require('../utils')

module.exports = {
  create: async (object) => {
    if (object.password) {
      object.password = await new Promise((resolve, reject) => {
        bcrypt.hash(object.password, bcrypt.genSaltSync(10), (err, hash) => {
          if (err) reject(err)
          resolve(hash)
        })
      })
    }

    return await Users.create(
      {
        ...object,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        deleted_at: null,
      },
      // { logging: console.log() },
    )
  },

  update: async (id, object) => {
    return await Users.update(
      {
        ...object,
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        where: {
          id: id,
          [Op.and]: { deleted_at: null },
        },
      },
    )
  },

  delete: async (id) => {
    return await Users.update(
      {
        deleted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
      { where: { id } },
    )
  },

  forceDelete: async (id) => {
    return await Users.destroy({ where: { id } })
  },

  read: async (id) => {
    return await Users.findOne({
      where: {
        id: id,
        [Op.and]: { deleted_at: null },
      },
      attributes: { exclude: ['password'] },
      include: [{ model: Brokers }],
    })
  },

  findEmail: async (email) => {
    return await Users.findOne({
      where: {
        email: email,
        [Op.and]: { deleted_at: null },
      },
      include: [{ model: Brokers }],
    })
  },

  find: async (object) => {
    const where = { [Op.and]: [] }

    if (object.filter) {
      filterSort.setFilter(where, object.filter || [], Users)
    }

    const order = []
    if (object.sort) {
      filterSort.setSort(order, object.sort || [], Users)
    }

    const { count, rows } = await Users.findAndCountAll({
      where: where || null,
      order: order || null,
      offset: object.from,
      limit: object.size,
      attributes: object.attributes || null,
      logging: object.logging || false,
    })

    if (count < 1) throw new Error('정보가 존재하지 않습니다.')

    return {
      total: count,
      rows,
    }
  },
}
