module.exports = {
  admin: (ctx, next) => {
    const user = ctx.user

    if (user.role !== '00') {
      ctx.throw(404, '관리자 권한이 없습니다.', { code: 'S9999', ctx })
    }

    return next()
  },
  professor: (ctx, next) => {
    const user = ctx.user

    // 관리자의 경우 패스
    if (user.role === '00') return next()

    if (user.role !== '10') {
      ctx.throw(404, '교수자 권한이 없습니다.', { code: 'S9999', ctx })
    }
    return next()
  },
  student: (ctx, next) => {
    const user = ctx.user

    // 관리자의 경우 패스
    if (user.role === '00') return next()

    if (user.role !== '20') {
      ctx.throw(404, '학습자 권한이 없습니다.', { code: 'S9999', ctx })
    }
    return next()
  },
}
