import SimulationService from '../services/SimulationService'
import moment from 'moment'

module.exports = {
  read: async (ctx) => {
    try {
      const simulation_id = ctx.params.id
      const simulation = await SimulationService.read(simulation_id)

      ctx.body = {
        code: 'S0001',
        data: {
          simulation: simulation,
        },
      }
    } catch (e) {
      const user = ctx.user
      ctx.throw(404, e.message, { code: 'S9999', user })
    }
  },
  update: async (ctx) => {
    try {
      const simulation_id = ctx.params.id
      const body = ctx.request.body

      const oldSimulation = await SimulationService.read(simulation_id)
      const now = moment().format('YYYY-MM-DD HH:mm:ss')

      const newSimulation = {
        ...oldSimulation,
        ...body.simulation,
        updated_at: now
      }

      const simulation = await SimulationService.update(simulation_id, newSimulation)

      ctx.body = {
        code: 'S0001',
        data: {
          simulation,
        },
      }
    } catch (e) {
      const user = ctx.user
      ctx.throw(404, e.message, { code: 'S9999', user })
    }
  },
}
