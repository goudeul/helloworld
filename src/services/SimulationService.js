import path from 'path'
import fsPromises from 'fs/promises'
import moment from 'moment'

const appDir = path.dirname(require.main.filename)
const directory = appDir + '/events/simulation/'

module.exports = {
  async create (simulation_id) {
    try {
      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      const simulation = {
        id: simulation_id,
        screenID: '01',
        isSharing: false,
        modeling: {
          position: {
            x: 37, y: 100, z: 3,
          },
          rotation: {
            x: 37, y: 100, z: 3,
          },
          scale: {
            x: 37, y: 100, z: 3,
          },
        },
        camera: {
          position: {
            x: 37, y: 100, z: 3,
          },
          rotation: {
            x: 37, y: 100, z: 3,
          },
        },
        button: {
          isRun: true, isInner: true, isFX: false,
        },
        created_at: now,
        updated_at: now,
      }

      await fsPromises.writeFile(directory + `${simulation_id}.json`,
        JSON.stringify(simulation))

      return simulation
    } catch (e) {
      return e
    }
  },
  async read (simulation_id) {
    try {
      const simulationFile = await fsPromises.open(directory + `${simulation_id}.json`)
        .catch((e) => {}) || null

      if (simulationFile) {
        const simulation = await simulationFile.readFile({ encoding: 'utf-8' })
        await simulationFile.close()
        return JSON.parse(simulation)
      }
    } catch (e) {
      return e
    }
  },
  async update (simulation_id, simulation) {
    try {
      await fsPromises.writeFile(directory + `${simulation_id}.json`,
        JSON.stringify(simulation))

      return simulation
    } catch (e) {
      return e
    }
  },
  async delete (simulation_id) {
    try {
      const simulationFile = await fsPromises.open(directory + `${simulation_id}.json`)
        .catch((e) => {}) || null

      if (simulationFile) {
        await fsPromises.rm(directory + `${simulationFile}.json`)
        await simulationFile.close()
        return true
      } else {
        return false
      }
    } catch (e) {
      return e
    }
  },
}
