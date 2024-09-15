import { Router } from 'express'
import { CommonController } from '../controllers'
import { CommonRepository } from '../repositories'
import { validateToken, validationJoi } from '../middlewares'
import { IdSchema, QuerySchema } from '../validators'
import { RouterOptionsInterface } from '../interfaces'

const CommonRouter = <T, R extends CommonRepository<T>>(
  controller: CommonController<T, R>,
  routerOptions?: RouterOptionsInterface
) => {
  const router = Router()

  if (!routerOptions?.canValidateToken) router.use(validateToken)

  router.get('/:id', controller.getOneById.bind(controller))

  router.get('/:id', validationJoi(IdSchema, 'params'), controller.getOneById.bind(controller))

  router.get('/', validationJoi(QuerySchema, 'query'), controller.getAll.bind(controller))

  router.post('/search', validationJoi(QuerySchema, 'query'), controller.getAll.bind(controller))

  router.post('/findOne', validationJoi(QuerySchema, 'query'), controller.getOneByFilters.bind(controller))

  router.post('/findOne/search', validationJoi(QuerySchema, 'query'), controller.getOneByFilters.bind(controller))

  if (!routerOptions?.onlyConsult) {
    router.post('/', validationJoi(routerOptions?.createSchema!), controller.create.bind(controller))

    router.put(
      '/:id',
      validationJoi(routerOptions?.updateSchema || routerOptions?.createSchema!),
      validationJoi(IdSchema, 'params'),
      controller.update.bind(controller),
    )

    router.delete('/:id', validationJoi(IdSchema, 'params'), controller.delete.bind(controller))

  }
  return router
}

export default CommonRouter