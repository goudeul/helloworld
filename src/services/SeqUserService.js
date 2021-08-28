const { user: Users } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const { filterSort } = require('../utils')
import moment from 'moment'

module.exports = {

  createPassword: async (password) => {
    return await new Promise((resolve, reject) => {
      bcrypt.hash(password, bcrypt.genSaltSync(10), (err, hash) => {
        if (err) reject(err)
        resolve(hash)
      })
    })
  },

  create: async (object) => {
    if (object.password) {
      object.password = await new Promise((resolve, reject) => {
        bcrypt.hash(object.password, bcrypt.genSaltSync(10), (err, hash) => {
          if (err) reject(err)
          resolve(hash)
        })
      })
    }

    const user = await Users.create(
      {
        ...object,
      },
    )

    return await Users.findOne({
      where: {
        id: user.id,
      },
      attributes: { exclude: ['password'] },
    })
  },

  update: async (id, object) => {
    await Users.update(
      {
        ...object,
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        where: {
          id: id,
        },
      },
    )

    return await Users.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ['password'] },
    })
  },

  delete: async (id) => {
    return await Users.destroy({ where: { id } })
  },

  read: async (id) => {
    return await Users.findOne({
      where: {
        id: id,
      },
      attributes: { exclude: ['password'] },
    })
  },

  readForce: async (id) => {
    return await Users.findOne({
      where: {
        id: id,
      },
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
