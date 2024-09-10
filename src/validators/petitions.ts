import Joi from 'joi'
import { type PaginationInterface, type IdInterface } from '../interfaces'

export const IdSchema = Joi.object<IdInterface>({
  id: Joi.number().required(),
})

export const QuerySchema = Joi.object<PaginationInterface|{search: string}>({
  page: Joi.number().allow(null),
  limit: Joi.number().allow(null),
  search: Joi.string().allow(null).empty(''),
})
