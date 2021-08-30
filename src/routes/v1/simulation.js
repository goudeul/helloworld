import Router from '@koa/router'
import SimulationController from '../../controllers/SeqSimulationController'
import auth from '../../middlewares/auth'

const router = new Router()

router.post('/:id', auth['admin'], auth['professor'], auth['passCheck'], SimulationController.create) // 시물레이션 생성
router.get('/:id', auth['all'], auth['passCheck'], SimulationController.read)                  // 시물레이션 상세
router.put('/:id', auth['admin'], auth['professor'], auth['passCheck'], SimulationController.update) // 시물레이션 변경
router.delete('/:id', auth['admin'], auth['professor'], auth['passCheck'], SimulationController.delete) // 시물레이션 삭제

module.exports = router
