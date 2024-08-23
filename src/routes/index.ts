import { Router } from 'express'
import { validateToken } from '../middlewares'
import { CommonRouter } from './common'
import { CommonController } from '../controllers'
import { CommonRepository } from '../repositories'
import { User } from '../models'

const router = Router()

router.use('/user', CommonRouter(new CommonController(new CommonRepository(User))))

router.use(validateToken)

router.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

export default router
