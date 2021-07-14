import path from 'path'
import fsPromises from 'fs/promises'
import bcrypt from 'bcryptjs'
import moment from 'moment'
import { checkDir } from '../utils/fsUtil'

const appDir = path.dirname(require.main.filename)
const directory = appDir + '/events/user/'
checkDir(directory)

module.exports = {
  async createPassword (password) {
    return await new Promise((resolve, reject) => {
      bcrypt.hash(password, bcrypt.genSaltSync(10), (err, hash) => {
        if (err) reject(err)
        resolve(hash)
      })
    })
  },
  async create (user) {
    try {
      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      user.password = await this.createPassword(user.password)

      user = {
        ...user,
        lastApiRequest: null,
        lastModifyPassword: now,
        failLoginCount: 0,
        isBlocked: false,
        created_at: now,
        updated_at: now,
      }

      await fsPromises.writeFile(directory + `${user.id}.json`,
        JSON.stringify(user))

      delete user.password
      return user
    } catch (e) {
      return e
    }
  },
  async read (id) {
    try {
      const userFile = await fsPromises.open(directory + `${id}.json`)
        .catch((e) => {}) || null

      if (userFile) {
        await userFile.close()
        return require(`../events/user/${id}.json`)
      }
    } catch (e) {
      return e
    }
  },
  async update (id, user) {
    try {
      await fsPromises.writeFile(directory + `${id}.json`,
        JSON.stringify(user))

      delete user.password
      return user
    } catch (e) {
      return e
    }
  },
  async delete (id) {
    try {
      const userFile = await fsPromises.open(directory + `${id}.json`)
        .catch((e) => {}) || null

      if (userFile) {
        await fsPromises.rm(directory + `${id}.json`)
        await userFile.close()
        return true
      } else {
        return false
      }
    } catch (e) {
      return e
    }
  },
}
