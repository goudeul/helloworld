import fsPromises from 'fs/promises'
import path from 'path'

const appDir = path.dirname(require.main.filename)
const directory = appDir + '/events/user/'

export default {
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
