'use strict'
import fs from 'fs'
import path from 'path'
import { Sequelize } from 'sequelize'

const basename = path.basename(__filename)
/*const env2 = process.env.NODE_ENV || 'development';
const config = require('../config/sequelize')[env2];*/

const db = {}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
})

// Read, Write Cluster 분리 (현재는 사용하지 않음)
// eslint-disable-next-line no-unused-vars
const sequelize2 = new Sequelize(process.env.DB_NAME, null, null, {
  dialect: 'mysql',
  replication: {
    write: {},
    read: {
      host: '1.1.1.1',
      username: 'write-username',
      password: process.env.WRITE_DB_PW,
    },
  },
  pool: {
    max: 20,
    idle: 30000,
  },
})

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    )
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// Fix the wrong count issue in findAndCountAll()
// 참조: https://github.com/sequelize/sequelize/issues/9481
sequelize.addHook('beforeCount', function (options) {
  if (this._scope.include && this._scope.include.length > 0) {
    options.distinct = true
    options.col =
      this._scope.col || options.col || `"${this.options.name.singular}".id`
  }

  if (options.include && options.include.length > 0) {
    options.include = null
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
