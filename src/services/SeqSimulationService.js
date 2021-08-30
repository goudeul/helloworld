const { simulation: Simulations } = require('../models')
import moment from 'moment'

module.exports = {

  async create (id) {
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    const simulation = {
      id: id,
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
        isRun: true,
        isInner: true,
        isFX: false,
        btnStatusGT: '0',
        btnStatusDE: '0',
        btnStatusRG: '0',
        btnStatusSP: '0',
      },
      parts: {
        isDiagramGT: false, isDiagramDE: false, diagramSpeed: 'normal', diagramStopTime: 0
      },
      created_at: now,
      updated_at: now,
    }
    await Simulations.create(simulation)

    return await Simulations.findOne({ where: { id } })
  },

  async read (id) {
    return await Simulations.findOne({ where: { id } })
  },

  async update (id, simulation) {
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    simulation.updated_at = now

    await Simulations.update(simulation, { where: { id } })

    return await Simulations.findOne({ where: { id } })
  },

  async delete (id) {
    return await Simulations.destroy({ where: { id } })
  },
}
