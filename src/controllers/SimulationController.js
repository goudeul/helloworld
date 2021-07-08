import SimulationService from '../services/SimulationService'

module.exports = {
  create: async ctx => {
    console.log(ctx)
    await SimulationService.create()
  }
}
