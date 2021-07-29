import Router from '@koa/router'
import auth from '../../middlewares/auth'
import userList from '../../tests/events/sampleUserList'

const router = new Router()

router.post('/user/search', auth['admin'], (ctx) => {
  ctx.body = {
    code: 'S0001',
    data: {
      users: userList,
    },
  }
})

module.exports = router
