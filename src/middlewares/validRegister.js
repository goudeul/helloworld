// import validUser from '../utils/vaildUser'
import validUser from '../utils/SeqVaildUser'

export async function validRegister (ctx, next) {
  const body = ctx.request.body
  const { id, password, role, phone, identityNumber } = body.user

  // if (!validUser.validID(id)) ctx.throw(404, '아이디에 사용할 수 없는 문자가 포함되었습니다.', { code: 'S9999', ctx })
  // if (!validUser.validPassword(password, id)) ctx.throw(404, '패스워드를 확인해주세요.', { code: 'S9999', ctx })
  
  let resultId = validUser.validID(id)
  if (resultId !=='') ctx.throw(404, resultId, { code: 'S9999', ctx })
  
  let resultPw = validUser.validPassword(password, id)
  if (resultPw !=='') ctx.throw(404, resultPw, { code: 'S9999', ctx })

  if (role === '10') {          // 교수 전화번호 체크
    if (!phone) ctx.throw(404, '교수회원은 전화번호가 필수입니다.', { code: 'S9999', ctx })
  } else if (role === '20') {   // 학생 학번 체크
    if (!identityNumber) ctx.throw(404, '학습회원은 학번이 필수입니다.', { code: 'S9999', ctx })
  }
  
  if (!await validUser.checkID(id)) ctx.throw(404, '동일한 아이디가 이미 존재합니다.', { code: 'S9999', ctx })

  await next()
}
