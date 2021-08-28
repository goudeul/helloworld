import SimulationService from '../services/SeqSimulationService'

module.exports = {

  //-------------------
  // CRUD
  //-------------------

  create: async (ctx) => {
    const id = ctx.params.id
    const simulation = await SimulationService.create(id)
    if (!simulation) ctx.throw(500, { message: '정보 생성에 실패 했습니다.' }, ctx)

    ctx.body = {
      code: 'S0001',
      data: {
        simulation: simulation,
      },
    }
  },

  read: async (ctx) => {
    const id = ctx.params.id
    const simulation = await SimulationService.read(id)

    ctx.body = {
      code: 'S0001',
      data: {
        simulation: simulation,
      },
    }
  },

  update: async (ctx) => {
    const id = ctx.params.id
    const newSimulation = ctx.request.body.simulation
    const simulation = await SimulationService.update(id, newSimulation)

    ctx.body = {
      code: 'S0001',
      data: {
        simulation,
      },
    }
  },

  delete: async (ctx) => {
    const id = ctx.params.id
    const simulation = await SimulationService.delete(id)

    if (!simulation) {
      ctx.throw(401, { message: '시뮬레이션 정보가 존재하지 않습니다.', ctx })
    }

    ctx.body = {
      code: 'S0001',
      data: {
        simulation: null,
      },
    }
  },
}
