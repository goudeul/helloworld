import path from 'path'
import fsPromises from 'fs/promises'
import bcrypt from 'bcryptjs'
import moment from 'moment'

const appDir = path.dirname(require.main.filename)
const directory = appDir + '/events/user/'

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
      return require(`../events/user/${id}.json`)
    } catch (e) {
      return e
    }
  },
  async update (id, user) {
    try {
      const oldUser = await this.read(id)
      const password = (user.password) ? await this.createPassword(user.password) : null
      const now = moment().format('YYYY-MM-DD HH:mm:ss')

      const newUser = {
        ...oldUser,
        name: user.name || oldUser.name,
        password: password || oldUser.password,
        phone: user.phone || oldUser.phone,
        identityNumber: user.identityNumber || oldUser.identityNumber,
        role: user.role || oldUser.role,
        lastModifyPassword:
          password ? now : oldUser.lastModifyPassword,
        updated_at: now,
      }

      await fsPromises.writeFile(directory + `${id}.json`,
        JSON.stringify(newUser))

      delete newUser.password
      return newUser
    } catch (e) {
      return e
    }
  },
  async delete (id) {
    try {
      const userFile = await fsPromises.open(directory + `${id}.json`)
        .catch((e) => { return e }) || null

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
