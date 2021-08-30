import Router from '@koa/router';
import ClassController from '../../controllers/SeqClassController';
import auth from '../../middlewares/auth';

const router = new Router();

router.post('/', auth['admin'], auth['professor'], auth['passCheck'], ClassController.create); // 클래스 생성
router.post('/search', auth['all'], auth['passCheck'], ClassController.search); // 클래스 조회
router.post('/join', auth['all'], auth['passCheck'], ClassController.join); // 클래스 입장
router.post('/exit', auth['all'], auth['passCheck'], ClassController.exit); // 클래스 퇴장
router.get('/:id', auth['admin'], auth['professor'], auth['passCheck'], ClassController.read); // 클래스 상세
router.delete('/:id', auth['admin'], auth['professor'], auth['passCheck'], ClassController.delete); // 클래스 종료

module.exports = router;
