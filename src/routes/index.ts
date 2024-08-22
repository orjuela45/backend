import { Router } from "express";
import { validateToken } from "../middlewares";

const router = Router()

router.use(validateToken)

router.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default router