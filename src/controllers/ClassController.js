import ClassService from '../services/ClassService'

module.exports = {
  create: async ctx => {
    console.log(ctx)
    await ClassService.create()
  }
}
