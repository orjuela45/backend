import { Router } from "express";

const router = Router()

router.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default router