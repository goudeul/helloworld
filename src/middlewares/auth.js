export const auth = {
  admin: async (ctx, done) => {},
  broker: async (ctx, done) => {
    if (ctx.user) {
      const broker_id = ctx.user.broker_id
      if (!broker_id) {
        ctx.throw(401, '권한이 없습니다.', { code: 'S9999' })
      }
    } else {
      ctx.throw(401, '유저정보가 없습니다.', { code: 'S9999' })
    }
    return done()
  },
  role: (aaa, ctx, done) => {
    console.log(aaa)
  }
}
