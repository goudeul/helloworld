import Router from '@koa/router'
import SettingController from '../../controllers/SettingController'
import auth from '../../middlewares/auth'
import userList from '../../tests/events/sampleUserList'

const router = new Router()

router.post('/user/search', (ctx) => {
  ctx.body = {
    code: 'S0001',
    data: {
      users: userList,
    },
  }
})

router.get('/setting', SettingController.read)
router.put('/setting', auth['admin'], SettingController.write)

module.exports = router
