import ClassService from '../services/ClassService'

module.exports = {
  create: async ctx => {
    try {
      const body = ctx.request.body
      const professor = ctx.user
      const cls = await ClassService.create(body.class, professor)

      ctx.body = {
        code: 'S0001',
        data: {
          class: cls,
        },
      }
    } catch (e) {
      const user = ctx.user
      ctx.throw(404, e.message, { code: 'S9999', user })
    }
  },
  search: async (ctx) => {
    try {
      const body = ctx.request.body
      // const { filter, from } = body
      const { size, sort } = body
      const classes = await ClassService.fetchList(size, sort)

      ctx.body = {
        code: 'S0001',
        data: {
          total: classes.length,
          class: classes
        },
      }
    } catch (e) {
      const user = ctx.user
      ctx.throw(404, e.message, { code: 'S9999', user })
    }
  },
}
