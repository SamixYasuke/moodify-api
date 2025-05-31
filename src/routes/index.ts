import { Router } from "express";
import pingRouter from "./ping.route";
import authRouter from "./auth.route";
import userRouter from "./user.route";

const router = Router();

router.use("/ping", pingRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);

export default router;
