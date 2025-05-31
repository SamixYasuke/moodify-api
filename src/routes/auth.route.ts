import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { authenticateAccessToken } from "../middlewares/authenticateJwt.middleware";

const router = Router();
const authController = new AuthController();

router.post("/signup/email", authController.registerUser);
router.post("/signin/email", authController.loginUser);
router.post("/logout", authenticateAccessToken, authController.logoutUser);
router.post("/refresh-token", authController.getAccessToken);

export default router;
