import { Router } from "express";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";
import UserController from "../controllers/user.controller";

const router = Router();
const userController = new UserController();

router.get("/", authenticateAccessToken, userController.getUserInfo);
router.post("/mood", authenticateAccessToken, userController.setUserMood);
router.post("/tasks", authenticateAccessToken, userController.createTask);
router.get("/tasks", authenticateAccessToken, userController.getTasks);
router.get(
  "/tasks/:taskId",
  authenticateAccessToken,
  userController.getTaskById
);
router.delete(
  "/tasks/:taskId",
  authenticateAccessToken,
  userController.getTaskById
);
router.patch(
  "/tasks/:taskId",
  authenticateAccessToken,
  userController.updateTask
);
router.delete(
  "/tasks/:taskId",
  authenticateAccessToken,
  userController.deleteTask
);
router.patch(
  "/settings/profile/username",
  authenticateAccessToken,
  userController.updateUsername
);
router.patch(
  "/settings/theme",
  authenticateAccessToken,
  userController.updateUserTheme
);

export default router;
