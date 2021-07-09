import Router from '@koa/router'
import UserController from '../../controllers/UserController'
import { validRegister } from '../../middlewares/validRegister'

const router = new Router()

router.post('/register', validRegister, UserController.create)      // 회원가입
router.post('/login', UserController.login)                         // 로그인
router.get('/me', UserController.me)                      // 본인정보 확인
router.put('/password', UserController.changePassword)              // 비밀번호 변경
router.put('/:id', UserController.update)                           // 회원 정보 변경
router.delete('/:id', UserController.delete)                        // 회원 삭제

module.exports = router
