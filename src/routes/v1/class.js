import Router from "@koa/router";
import ClassController from "../../controllers/SeqClassController";
import auth from "../../middlewares/auth";

const router = new Router();

router.post("/", auth["professor"], ClassController.create); // 클래스 생성
router.post("/search", auth["all"], ClassController.search); // 클래스 조회
router.post("/join", auth["student"], ClassController.join); // 클래스 입장
router.post("/exit", auth["student"], ClassController.exit); // 클래스 퇴장
router.get("/:id", auth["professor"], ClassController.read); // 클래스 상세
router.delete("/:id", auth["professor"], ClassController.delete); // 클래스 종료

module.exports = router;
