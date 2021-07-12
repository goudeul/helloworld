import Router from '@koa/router'
import SimulationController from '../../controllers/SimulationController'

const router = new Router()

router.get('/:id', SimulationController.read)   // 시물레이션 상세
router.put('/:id', SimulationController.update)         // 시물레이션 변경

module.exports = router
