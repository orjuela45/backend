import { Router } from 'express'
import { UserInterface } from 'share/interfaces'
import { validateToken } from '../middlewares'
import { UserController } from '../controllers/user'
import { CommonRepository } from '../repositories'
import CommonRouter from './common'
import AuthRouter from './auth'

const router = Router()

router.get('/test', (req, res) => {
  return res.status(200).json({ msg: 'Ruta en prueba' })
})

router.get('/testToken', validateToken, (req, res) => {
  return res.status(200).json({ msg: 'Ruta en prueba con token' })
})

router.use('/auth', AuthRouter)
router.use('/user', CommonRouter<UserInterface, CommonRepository<UserInterface>>(new UserController()))

export default router
