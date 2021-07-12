import Router from '@koa/router'
import ClassController from '../../controllers/ClassController'

const router = new Router()

router.post('/', ClassController.create)          // 클래스 생성
router.post('/search', ClassController.search)    // 클래스 조회
router.post('/join', ClassController.join)      // 클래스 입장
router.post('/exit', ClassController.exit)      // 클래스 퇴장
router.get('/:id', ClassController.read)  // 클래스 상세
router.delete('/:id', ClassController.delete)     // 클래스 종료

module.exports = router
