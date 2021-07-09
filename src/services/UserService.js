import path from 'path'
import fsPromises from 'fs/promises'
import fs from 'fs'
import bcrypt from 'bcryptjs'

const appDir = path.dirname(require.main.filename)
const directory = appDir + '/events/user/'

module.exports = {
  create: async (user) => {
    user.password = await new Promise((resolve, reject) => {
      bcrypt.hash(user.password, bcrypt.genSaltSync(10), (err, hash) => {
        if (err) reject(err)
        resolve(hash)
      })
    })

    await fsPromises.writeFile(directory + `${user.id}.json`,
      JSON.stringify(user))

    delete user.password
    return user

    /*// const aa = await fs.open(directory + '/' + id + '.json')
    const aa = await fs.open(directory + '/aa')
    const bb = await fs.read(aa)

    console.log(bb)

    const files = await fs.readdir(directory)
    console.log(files)*/

    /*if (object.password) {
      object.password = await new Promise((resolve, reject) => {
        bcrypt.hash(object.password, bcrypt.genSaltSync(10), (err, hash) => {
          if (err) reject(err)
          resolve(hash)
        })
      })
    }*/
  },
  read: async (id) => {
    const file = require(`../events/user/${id}.json`)
    console.log(file)
  },
}
