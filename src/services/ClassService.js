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
      const class_id = uniqid()

      cls = {
        id: class_id,
        name: cls.name,
        lastApiRequest: now,
        created_at: now,
        professor: {
          id: professor.id,
          name: professor.name,
          role: professor.role,
        },
        students: [],
      }

      await fsPromises.writeFile(
        directory + `${class_id}.json`,
        JSON.stringify(cls),
      )

      return cls
    } catch (e) {
      return e
    }
  },
  async read (class_id) {
    try {
      const classFile = await fsPromises
        .open(directory + `${class_id}.json`)
        .catch((e) => {}) || null

      if (classFile) {
        const cls = await classFile.readFile({ encoding: 'utf-8' })
        await classFile.close()
        return JSON.parse(cls)
      }
    } catch (e) {
      return e
    }
  },
  async update (class_id, cls) {
    try {
      await fsPromises.writeFile(
        directory + `${class_id}.json`,
        JSON.stringify(cls),
      )

      return cls
    } catch (e) {
      return e
    }
  },
  async delete (class_id) {
    try {
      const classFile =
        (await fsPromises
          .open(directory + `${class_id}.json`)
          .catch((e) => {})) || null

      if (classFile) {
        await fsPromises.rm(directory + `${class_id}.json`)
        await classFile.close()

        return true
      } else {
        return false
      }
    } catch (e) {
      return e
    }
  },
  async fetchList (size, sort) {
    try {
      const files = (await fsPromises.readdir(directory)).filter(str => str !== 'blank')
      const classes = await Promise.all(files.map((id) => {
        return fsPromises.readFile(directory + `${id}`, { encoding: 'utf-8' })
      }))

      return classes.map(ele => JSON.parse(ele))
    } catch (e) {
      return e
    }
  },
}
