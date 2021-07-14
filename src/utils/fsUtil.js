import fs from 'fs'

module.exports = {
  checkDir (dir) {
    if (!fs.existsSync(dir)) {
      console.log('make directory ' + dir)
      fs.mkdirSync(dir)
    }
  },
}
