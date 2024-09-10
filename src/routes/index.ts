import { Router } from 'express'
import { validateToken } from '../middlewares'
import { CommonRouter } from './common'
import { UserInterface } from 'share/interfaces'
import { UserController } from '../controllers/user'
import { CommonRepository } from '../repositories'

const router = Router()

router.get('/test',(req, res, next) => {
  return res.status(200).json({ msg: 'Ruta en prueba' })
})

router.use(validateToken)

router.get('/testToken',(req, res, next) => {
  return res.status(200).json({ msg: 'Ruta en prueba con token' })
})

router.use('/user', CommonRouter<UserInterface, CommonRepository<UserInterface>>(new UserController()))

export default router
