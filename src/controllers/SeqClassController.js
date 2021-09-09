import moment from 'moment'
import ClassService from '../services/SeqClassService'
import SimulationService from '../services/SeqSimulationService'
import crypter from '../utils/crypter'

/**
 * @description 클래스 암호 해제
 * @param {object} cls - 클래스
 * @returns {object} - 클래스
 */
function decrypt_class(cls) {
  if (!cls) return cls
  cls.professor = crypter.decrypt_user(cls.professor)
  const students = []
  for (const user of cls.students) {
    students.push(crypter.decrypt_user(user))
  }
  cls.students = students
  return cls
}

module.exports = {

  /**
   * @description 클래스 검색
   * @param {object} ctx - 컨텍스트
   * @returns {JSON} - 클래스자리스트
   */
  search: async (ctx) => {
    const body = ctx.request.body
    const classes = await ClassService.find(body)

    if (classes.total > 0) {
      const rows = []
      for (const cls of classes.rows) {
        rows.push(decrypt_class(cls))
      }
      classes.rows = rows
    }

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

    let cls = await ClassService.read(id)

    const index = cls.students.findIndex(ele => ele.id === student.id)
    if (index < 0) cls.students.push(student)

    await ClassService.update(id, cls.dataValues)

    cls = decrypt_class(cls)

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

    let cls = await ClassService.read(id)

    const index = cls.students.findIndex(ele => ele.id === student.id)
    if (index > -1) cls.students.splice(index, 1)

    await ClassService.update(id, cls.dataValues)

    cls = decrypt_class(cls)

    ctx.body = {
      code: 'S0001',
      data: {
        class: cls,
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
    const professor = crypter.encrypt_user(ctx.user)

    const cls = await ClassService.create(body.class, professor)

    if (cls) await SimulationService.create(cls.id)

    cls.professor = crypter.decrypt_user(cls.professor)

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
    let cls = await ClassService.read(id)

    cls = decrypt_class(cls)

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
