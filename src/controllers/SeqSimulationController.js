import SimulationService from '../services/SeqSimulationService'

module.exports = {

  //-------------------
  // CRUD
  //-------------------

  /**
   * @description 시물레이션 생성
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 시물레이션 생성결과
   */
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

  /**
   * @description 시물레이션 상세
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 시물레이션 상세정보
   */
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

  /**
   * @description 시물레이션 변경
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 시물레이션 변경결과
   */
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

  /**
   * @description 시물레이션 삭제
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 시물레이션 삭제결과
   */
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
