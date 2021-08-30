module.exports = {
  admin: (ctx, next) => {
    const user = ctx.user
    if (user && user.role && user.role === '00') {  // 관리자 권한있음
      ctx.pass = true
    }
    return next()
  },
  professor: (ctx, next) => {
    const user = ctx.user
    if (user && user.role && user.role === '10') {  // 교수자 권한있음
      ctx.pass = true
    }
    return next()
  },
  student: (ctx, next) => {
    const user = ctx.user
    if (user && user.role && user.role === '20') {  // 학생 권한있음
      ctx.pass = true
    }
    return next()
  },
  me: (ctx, next) => {
    const user = ctx.user
    const id = ctx.params.id
    if (user && user.role && user.id === id) {  // 본인 권한있음
      ctx.pass = true
    }
    return next()
  },
  all: (ctx, next) => {
    const user = ctx.user
    if (user && user.role) {  // any 권한있음
      ctx.pass = true
    }
    return next()
  },
  passCheck: (ctx, next) => {
    if (!ctx.pass) {
      ctx.throw(404, '권한이 없습니다.', { code: 'S9001', ctx })
    }
    return next()
  }
}
