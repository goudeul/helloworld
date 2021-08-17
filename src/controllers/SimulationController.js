import SimulationService from '../services/SimulationService'
import moment from 'moment'

module.exports = {
  create: async (ctx) => {
    try {
      const simulation_id = ctx.params.id
      const simulation = await SimulationService.create(simulation_id)

      ctx.body = {
        code: 'S0001',
        data: {
          simulation: simulation,
        },
      }
    } catch (e) {
      ctx.throw(401, { message: e.message, ctx })
    }
  },
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
      ctx.throw(401, { message: e.message, ctx })
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
      ctx.throw(401, { message: e.message, ctx })
    }
  },
  delete: async (ctx) => {
    try {
      const simulation_id = ctx.params.id
      const simulation = await SimulationService.delete(simulation_id)

      if (!simulation) {
        ctx.throw(401, { message: '시뮬레이션 정보가 존재하지 않습니다.', ctx })
      }

      ctx.body = {
        code: 'S0001',
        data: {
          simulation: null,
        },
      }
    } catch (e) {
      ctx.throw(401, { message: e.message, ctx })
    }
  },  
}
