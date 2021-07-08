import Router from '@koa/router'
import UserController from '../../controllers/UserController'

const router = new Router()

router.post('/register', UserController.create)     // 회원가입
router.post('/login', UserController.create)        // 로그인
router.get('/me', UserController.create)      // 본인정보 확인
router.put('/:id', UserController.create)           // 패스워드 변경
router.delete('/:id', UserController.create)        // 회원 삭제

module.exports = router
