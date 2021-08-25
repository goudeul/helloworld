import Router from '@koa/router'
import LogsController from '../../controllers/LogsController'

const router = new Router()

router.post('/search', LogsController.getList)
router.post('/all', LogsController.getListAll)

module.exports = router
