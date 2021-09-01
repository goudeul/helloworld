import moment from 'moment'
import ClassService from '../services/SeqClassService'
import SimulationService from '../services/SeqSimulationService'

module.exports = {

  /**
   * @description 클래스 검색
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 클래스자리스트
   */
  search: async (ctx) => {
    const body = ctx.request.body
    const classes = await ClassService.find(body)

    ctx.body = {
      code: 'S0001',
      data: {
        total: classes.total,
        class: classes,
      },
    }
  },

  /**
   * @description 클래스 입장
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 클래스 입장결과
   */
  join: async (ctx) => {
    const { id } = ctx.request.body.class
    const student = ctx.user

    const cls = await ClassService.read(id)
    const { students } = cls

    const index = students.findIndex(ele => ele.id === student.id)
    if (index < 0) students.push(student)

    await ClassService.update(id, cls.dataValues)

    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    ctx.body = {
      code: 'S0001',
      data: {
        joined_at: now,
        class: cls,
      },
    }
  },

  /**
   * @description 클래스 퇴장
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 클래스 퇴장결과
   */
  exit: async (ctx) => {
    const { id } = ctx.request.body.class
    const student = ctx.user

    const cls = await ClassService.read(id)
    const { students } = cls

    const index = students.findIndex(ele => ele.id === student.id)
    if (index > -1) students.splice(index, 1)

    await ClassService.update(id, cls.dataValues)

    ctx.body = {
      code: 'S0001',
      data: {
        class: null,
      },
    }
  },

  //-------------------
  // CRUD
  //-------------------

  /**
   * @description 클래스 생성
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 클래스 생성결과
   */
  create: async (ctx) => {
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
  },

  /**
   * @description 클래스 상세정보
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 클래스 상세정보
   */
  read: async (ctx) => {
    const id = ctx.params.id
    const cls = await ClassService.read(id)

    ctx.body = {
      code: 'S0001',
      data: {
        class: cls,
      },
    }
  },

  /**
   * @description 클래스 종료
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 클래스 종료결과
   */
  delete: async (ctx) => {
    const id = ctx.params.id

    const result = await ClassService.delete(id)
    if (result) await SimulationService.delete(id)

    ctx.body = {
      code: 'S0001',
      data: {
        class: null,
      },
    }
  },
}
