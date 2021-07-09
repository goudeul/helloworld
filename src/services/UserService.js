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
  },
  async read (id) {
    try {
      return require(`../events/user/${id}.json`)
    } catch (e) {
      return false
    }
  },
  async update (id, user) {
    const userFile = await this.read(id)
    const password = (user.password) ? await this.createPassword(user.password) : null
    const now = moment().format('YYYY-MM-DD HH:mm:ss')

    const changeUser = {
      ...userFile,
      name: user.name || userFile.name,
      password: password || userFile.password,
      phone: user.phone || userFile.phone,
      identityNumber: user.identityNumber || userFile.identityNumber,
      role: user.role || userFile.role,
      lastModifyPassword:
        password ? now : userFile.lastModifyPassword,
      updated_at: now,
    }

    await fsPromises.writeFile(directory + `${id}.json`,
      JSON.stringify(changeUser))

    delete changeUser.password
    return changeUser
  },
  async delete (id) {
    const userFile = await fsPromises.open(directory + `${id}.json`)
      .catch(() => {}) || null

    if (userFile) {
      await fsPromises.rm(directory + `${id}.json`)
      return null
    } else {
      return false
    }
  },
}
