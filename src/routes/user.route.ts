import { Router } from "express";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";
import UserController from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.get("/", authenticateAccessToken, userController.getUserInfo);
router.post("/mood", authenticateAccessToken, userController.setUserMood);
router.post("/task", authenticateAccessToken, userController.createTask);

export default router;
