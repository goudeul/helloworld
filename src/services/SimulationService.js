import fs from 'fs'
import path from 'path'

const appDir = path.dirname(require.main.filename)
const directory = appDir + '/events/user'

module.exports = {
  create: async (object) => {
    fs.readdir(directory, (err, filelist) => {
      console.log(filelist)
    })
  },
}
