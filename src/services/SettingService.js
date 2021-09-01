import path from 'path'
import fsPromises from 'fs/promises'
import moment from 'moment'

const appDir = path.dirname(require.main.filename)
const directory = appDir + '/events/'

module.exports = {
  async write (setting) {
    try {
      const now = moment().format('YYYY-MM-DD HH:mm:ss')

      setting = {
        ...setting,
        updated_at: now,
      }

      await fsPromises.writeFile(directory + 'setting.json',
        JSON.stringify(setting))

      return setting
    } catch (e) {
      return e
    }
  },
  async read () {
    try {
      const settingFile = await fsPromises.open(directory + 'setting.json')
        .catch((e) => { }) || null

      if (settingFile) {
        const setting = await settingFile.readFile({ encoding: 'utf-8' })
        await settingFile.close()
        return JSON.parse(setting)
      } else {
        const setting = {
          passwordPeriods: 0
        }
        return setting
      }
    } catch (e) {
      return e
    }
  },
}
