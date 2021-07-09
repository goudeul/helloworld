import path from 'path'
import fsPromises from 'fs/promises'

const appDir = path.dirname(require.main.filename)
const directory = appDir + '/events/user/'

const fn = {
  /**
   * @todo 로직 구현 요망
   * @desc 비밀번호 검증
   * @param password
   * @returns {boolean}
   */
  validPassword (password) {
    return true
  },
  /**
   * @todo 로직 구현 요망
   * @desc 아이디 특수문자 확인
   * @param id
   * @returns {boolean}
   */
  validID (id) {
    return true
  },
  /**
   * @desc 동일 아이디 존재 확인
   * @param id
   * @returns {Promise<boolean>}
   */
  async checkID (id) {
    const userFile = await fsPromises.open(directory + `${id}.json`)
      .catch(() => {}) || null

    if (userFile) {
      await userFile.close()
      return false
    } else {
      return true
    }
  },
}

export async function validRegister (ctx, next) {
  const body = ctx.request.body
  const { id, password, role, phone, identityNumber } = body.user

  if (!fn.validPassword(password)) ctx.throw(404, '패스워드를 확인해주세요.', { code: 'S9999' })
  if (!fn.validID(id)) ctx.throw(404, '아이디에 사용할 수 없는 문자가 포함되었습니다.', { code: 'S9999' })

  if (role === '10') {          // 교수 전화번호 체크
    if (!phone) ctx.throw(404, '교수회원은 전화번호가 필수입니다.', { code: 'S9999' })
  } else if (role === '20') {   // 학생 학번 체크
    if (!identityNumber) ctx.throw(404, '학습회원은 학번이 필수입니다.', { code: 'S9999' })
  }

  if (!await fn.checkID(id)) ctx.throw(404, '동일한 아이디가 이미 존재합니다.', { code: 'S9999' })

  await next()
}
