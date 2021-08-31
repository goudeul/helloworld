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

  create: async (user) => {
    if (user.password) {
      user.password = await new Promise((resolve, reject) => {
        bcrypt.hash(user.password, bcrypt.genSaltSync(10), (err, hash) => {
          if (err) reject(err)
          resolve(hash)
        })
      })
    }

    const result = await Users.create(user)
    return await Users.findOne({
      where: {
        id: result.id,
      },
      attributes: { exclude: ['password'] },
    })
  },

  update: async (id, user) => {
    await Users.update(
      {
        ...user,
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        where: { id }
      },
    )

    return await Users.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    })
  },

  delete: async (id) => {
    return await Users.destroy({ where: { id } })
  },

  read: async (id) => {
    return await Users.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    })
  },

  readForce: async (id) => {
    return await Users.findOne({
      where: { id }
    })
  },

  find: async (body) => {
    const where = { [Op.and]: [] }

    if (body.filter) {
      filterSort.setFilter(where, body.filter || [], Users)
    }

    const order = []
    if (body.sort) {
      filterSort.setSort(order, body.sort || [], Users)
    }

    const { count, rows } = await Users.findAndCountAll({
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
