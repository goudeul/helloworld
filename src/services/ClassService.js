import path from 'path'
import fsPromises from 'fs/promises'
import moment from 'moment'
import uniqid from 'uniqid'

const appDir = path.dirname(require.main.filename)
const directory = appDir + '/events/class/'

module.exports = {
  async create (cls, professor) {
    try {
      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      const id = uniqid()

      cls = {
        id: id,
        name: cls.name,
        lastApiRequest: now,
        created_at: now,
        professor: {
          id: professor.id,
          name: professor.name,
          role: professor.role,
        },
      }

      await fsPromises.writeFile(directory + `${id}.json`,
        JSON.stringify(cls))

      return cls
    } catch (e) {
      return e
    }
  },
  async read (id) {},
  async fetchList (size, sort) {
    try {
      const files = await fsPromises.readdir(directory)
      return files.map(ele => {
        return require(`../events/class/${ele}`)
      })
    } catch (e) {
      return e
    }
  },
}
