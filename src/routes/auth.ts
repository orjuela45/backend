import { Router } from "express";
import { loginSchema } from "share/validators";
import { AuthController } from "../controllers";
import { validationJoi } from "../middlewares";

const router = Router()
const authController = new AuthController()

router.post('/login', validationJoi(loginSchema), authController.login)

export default router