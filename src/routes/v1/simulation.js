import Router from '@koa/router'
import SimulationController from '../../controllers/SimulationController'
import auth from '../../middlewares/auth'

const router = new Router()

router.get('/:id', SimulationController.read)   // 시물레이션 상세
router.put('/:id', auth['professor'], SimulationController.update)         // 시물레이션 변경

module.exports = router
