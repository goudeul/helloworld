import moment from 'moment'
import ClassService from '../services/ClassService'
import SimulationService from '../services/SimulationService'

module.exports = {
  create: async ctx => {
    try {
      const body = ctx.request.body
      const professor = ctx.user
      const cls = await ClassService.create(body.class, professor)

      if (cls) await SimulationService.create(cls.id)

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
          class: classes,
        },
      }
    } catch (e) {
      const user = ctx.user
      ctx.throw(404, e.message, { code: 'S9999', user })
    }
  },
  join: async (ctx) => {
    try {
      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      const body = ctx.request.body
      const { id: class_id } = body.class
      const student = ctx.user

      const oldClass = await ClassService.read(class_id)
      const { students } = oldClass

      const index = students.findIndex(ele => ele.id === student.id)

      if (index === -1) {
        oldClass.students.push(student)
      }

      const cls = await ClassService.update(class_id, oldClass)

      ctx.body = {
        code: 'S0001',
        data: {
          joined_at: now,
          class: cls,
        },
      }
    } catch (e) {
      const user = ctx.user
      ctx.throw(404, e.message, { code: 'S9999', user })
    }
  },
  exit: async (ctx) => {
    try {
      const body = ctx.request.body
      const { id: class_id } = body.class
      const student = ctx.user

      const oldClass = await ClassService.read(class_id)
      const { students } = oldClass

      const index = students.findIndex(ele => ele.id === student.id)

      if (index > -1) {
        students.splice(index, 1)
      }

      await ClassService.update(class_id, oldClass)

      ctx.body = {
        code: 'S0001',
        data: {
          class: null,
        },
      }
    } catch (e) {
      const user = ctx.user
      ctx.throw(404, e.message, { code: 'S9999', user })
    }
  },
  read: async (ctx) => {
    try {
      const class_id = ctx.params.id
      const cls = await ClassService.read(class_id)

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
  delete: async (ctx) => {
    const class_id = ctx.params.id

    const result = await ClassService.delete(class_id)
    if (result) await SimulationService.delete(class_id)

    ctx.body = {
      code: 'S0001',
      data: {
        class: null,
      },
    }
  },
}
