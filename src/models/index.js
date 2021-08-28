'use strict'
import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

const basename = path.basename(__filename)
const db = {}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    // 날짜의 경우 문자열로 처리 필요 (https://lahuman.github.io/sequelize_timezone/)
    dialectOptions: { charset: 'utf8mb4', dateStrings: true, typeCast: true },
    timezone: '+09:00',
    logging: false,
  })

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize['DataTypes'],
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
  if (this['_scope'].include && this['_scope'].include.length > 0) {
    options.distinct = true
    options.col =
      this['_scope'].col || options.col || `"${this.options.name.singular}".id`
  }

  if (options.include && options.include.length > 0) {
    options.include = null
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
