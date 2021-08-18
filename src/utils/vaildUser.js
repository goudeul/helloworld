import fsPromises from 'fs/promises'
import path from 'path'

const appDir = path.dirname(require.main.filename)
const directory = appDir + '/../coarsoft_pv/events/user/'

export default {
  /**
   * @desc 비밀번호 검증
   *   숫자, 문자, 특수 혼합하여 9자 ~ 20자
   *   아이디와 다르게
   *   동일문자 3회 이상 반복 금지
   *   오름차순, 내림차순 3회 이상 금지
   * @param password
   * @returns {boolean}
   */
  validPassword (pw, id) {

    try {
      if (pw.length < 9 || pw.length > 20) return '비밀번호는 9자리 ~ 20자리 이내 이여야 합니다.'

      if (pw.search(/\s/) !== -1) return '비밀번호는 공백 없이 입력해주세요.'

      if (id !== undefined) {
        try {
          if (pw.search(id) > -1) return '비밀번호에 아이디가 포함되었습니다.'
        } catch (e) {}
      }

      const num = pw.search(/[0-9]/g)
      const eng = pw.search(/[a-z]/ig)
      const spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi)
      if (num < 0 || eng < 0 || spe < 0) return '비밀번호는 영문,숫자,특수문자를 혼합하여 입력해주세요.'

      const eachcheck = /(\w)\1\1/
      if (eachcheck.test(pw)) return '비밀번호에 같은 문자나 숫자를 연속 3번 이상 사용하실 수 없습니다.'

      const eachcheck2 = /([\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"])\1\1/
      if (eachcheck2.test(pw)) return '비밀번호에 같은 특수문자를 연속 3번 이상 사용하실 수 없습니다.'

      if (!stck(pw)) return '비밀번호에 연속된 3자리 이상 문자는 사용하실 수 없습니다.'

    } catch (e) {
      console.error(e.message)
      return '비밀번호 체크에 실패했습니다.'
    }

    return ''
  },

  /**
   * @desc 아이디 검증
   *   4자리 ~ 20자
   *   파일생성 불가 문자 제외 (\/:*?"<>|)
   * @param id
   * @returns {boolean}
   */
  validID (id) {

    try {
      if (id.length < 4 || id.length > 20) return '아이디는 4자리 ~ 20자리 이내로 입력해주세요.'

      if (id.search(/\s/) !== -1) return '아이디에 공백 없이 입력해주세요.'

      // const pattern = /[!@#$%^&*/]/
      // if(pattern.test(id) ) return '아이디에 특수문자 !@#$%^&*/ 를 제거해주세요.'

      const pattern = /[\/:*?"<>|]/
      if (pattern.test(id)) return '아이디에 특수문자 \/:*?"<>| 를 제거해주세요.'

    } catch (e) {
      console.error(e.message)
      return '아이디 체크에 실패했습니다.'
    }

    return ''
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

// 연속된 문자 +- 체크용 함수
function stck (str, limit) {

  limit = limit || 3
  let o, d, p, n = 0
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i)
    if (i > 0 && (p = o - c) > -2 && p < 2 && (n = p === d ? n + 1 : 0) > limit - 3)
      return false
    d = p, o = c
  }
  return true
}
