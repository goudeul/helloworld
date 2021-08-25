import Router from '@koa/router'
import UserController from '../../controllers/SeqUserController'
import { validRegister } from '../../middlewares/validRegister'
import { validPassword } from '../../middlewares/validPassword'
import auth from '../../middlewares/auth'

const router = new Router()

router.post('/register', validRegister, UserController.create)      // 회원가입 (권한체크없음)
// router.post('/register', auth['admin'], validRegister, UserController.create)      // 회원가입
router.post('/login', UserController.login)                         // 로그인
router.get('/me', UserController.me)                                // 본인정보 확인
router.put('/password', auth['all'], validPassword, UserController.changePassword)              // 비밀번호 변경
router.put('/:id', auth['admin'], UserController.update)                           // 회원 정보 변경
router.delete('/:id', auth['admin'], UserController.delete)                        // 회원 삭제

module.exports = router
