import { Router } from 'express'
import { CommonController } from '../controllers'
import { CommonRepository } from '../repositories'
import { Schema } from 'joi'
import { validationJoi } from '../middlewares'
import { IdSchema, QuerySchema } from '../validators'

export const CommonRouter = <T, R extends CommonRepository<T>>(
  controller: CommonController<T, R>,
  onlyConsult?: boolean,
  createSchema?: Schema,
  updateSchema?: Schema,
) => {
  const router = Router()

  router.get('/:id', controller.getOneById.bind(controller))

  router.get('/:id', validationJoi(IdSchema, 'params'), controller.getOneById.bind(controller))

  router.get('/', validationJoi(QuerySchema, 'query'), controller.getAll.bind(controller))

  router.post('/search', validationJoi(QuerySchema, 'query'), controller.getAll.bind(controller))

  if (!onlyConsult) {
    router.post('/', validationJoi(createSchema!), controller.create.bind(controller))

    router.put(
      '/:id',
      validationJoi(updateSchema || createSchema!),
      validationJoi(IdSchema, 'params'),
      controller.update.bind(controller),
    )

    router.delete('/:id', validationJoi(IdSchema, 'params'), controller.delete.bind(controller))

  }
  return router
}
