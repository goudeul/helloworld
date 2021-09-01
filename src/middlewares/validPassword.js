import validUser from '../utils/SeqVaildUser'

/**
 * @description 비밀번호 검증
 *   숫자, 문자, 특수 혼합하여 9자 ~ 20자
 *   공백불가
 *   아이디와 다르게
 *   동일문자 3회 이상 반복 금지
 *   오름차순, 내림차순 3회 이상 금지
 * @param {object} ctx - 컨텍스트
 * @param {object} next - 다음 미들웨어 전달용 함수
 */
export async function validPassword (ctx, next) {
  const id = ctx.params.id
  const { new_password } = ctx.request.body.user

  const resultPw = validUser.validPassword(new_password, id)
  if (resultPw !== '') ctx.throw(404, resultPw, { code: 'S9999', ctx })

  await next()
}
