import { Router } from 'express'
import { CommonController } from '../controllers'
import { CommonRepository } from '../repositories'

export const CommonRouter = <T, R extends CommonRepository<T>>(controller: CommonController<T, R>) => {
  const router = Router()

  router.get(
    '/:id',
    controller.getOneById.bind(controller),
  );

  return router
}
