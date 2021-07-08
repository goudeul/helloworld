import fsPromises from 'fs/promises'
import fs from 'fs'
import path from 'path'

// import bcrypt from 'bcryptjs'

const appDir = path.dirname(require.main.filename)
const directory = appDir + '/events/user'

module.exports = {
  create: async (user) => {
    const { id } = user

    const aa = await fsPromises.open(directory + '/aa1').catch(e => console.log(e)) || null
    console.log(aa)
    // await aa.close()

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

    return user
  },
  read: async () => {
    const file = require(`../events/user/${id}.json`)
    console.log(file)
  },
}
