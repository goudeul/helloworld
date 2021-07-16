import validUser from '../utils/vaildUser'

export async function validPassword (ctx, next) {
  const body = ctx.request.body
  const { password, new_password } = body.user

  // if (!validUser.validPassword(new_password)) ctx.throw(404, '패스워드를 확인해주세요.', { code: 'S9999', ctx })

  let resultPw = validUser.validPassword(new_password)
  if (resultPw !== '') ctx.throw(404, resultPw, { code: 'S9999', ctx })

  await next()
}
