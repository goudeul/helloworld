// import validUser from '../utils/vaildUser'
import validUser from '../utils/SeqVaildUser'

export async function validPassword (ctx, next) {
  const id = ctx.params.id
  const { new_password } = ctx.request.body.user

  const resultPw = validUser.validPassword(new_password, id)
  if (resultPw !== '') ctx.throw(404, resultPw, { code: 'S9999', ctx })

  await next()
}
