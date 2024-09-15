import { Model, FilterQuery, UpdateQuery } from 'mongoose'
import createHttpError from 'http-errors'
import { CustomOptionsInterface, PaginationInterface } from '../interfaces'

export class CommonRepository<T> {
  public model: Model<T>

  constructor(model: Model<T>) {
    this.model = model
  }

  public async getOneById(id: string, customOptions?: CustomOptionsInterface) {
    const result = await this.model.findById(id)
    if (!result) throw createHttpError.NotFound(customOptions?.customMessage ?? 'Recurso no encontrado')
    return result
  }

  public async getOneByFiltes(filters: FilterQuery<T>, customOptions?: CustomOptionsInterface) {
    const result = await this.model.findOne(filters)
    if (!result) throw createHttpError.NotFound(customOptions?.customMessage ?? 'Recurso no encontrado')
    return result
  }

  public async getAll(filters?: FilterQuery<T>, customOptions?: CustomOptionsInterface) {
    const result = await this.model.find(filters || {})
    if (!result) throw createHttpError.NotFound(customOptions?.customMessage ?? 'Recurso no encontrado')
    return result
  }

  public async getAllWithPagination(
    pagination?: PaginationInterface,
    filters?: FilterQuery<T>,
    customOptions?: CustomOptionsInterface,
  ) {
    const { page = 0, limit = 100 } = pagination as PaginationInterface
    const total = await this.model.countDocuments(filters || {})
    const result = await this.model
      .find(filters || {})
      .skip(page * limit)
      .limit(limit)
    if (!result) throw createHttpError.NotFound(customOptions?.customMessage ?? 'Recurso no encontrado')
    return {
      data: result,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    }
  }

  public async create(document: T, customOptions?: CustomOptionsInterface) {
    try {
      const result = await this.model.create(document)
      return result
    } catch (error) {
      throw createHttpError.BadRequest(customOptions?.customMessage ?? 'Error creando recurso')
    }
  }

  public async update(id: string, document: UpdateQuery<T>, customOptions?: CustomOptionsInterface) {
    try {
      const result = await this.model.findByIdAndUpdate(id, document, { new: true })
      if (!result) throw createHttpError.NotFound('Recurso no encontrado')
      return result
    } catch (error) {
      throw createHttpError.BadRequest(customOptions?.customMessage ?? 'Error actualizando recurso')
    }
  }

  public async delete(id: string, customOptions?: CustomOptionsInterface) {
    try {
      const result = await this.model.findByIdAndDelete(id)
      if (!result) throw createHttpError.NotFound('Recurso no encontrado')
      return result
    } catch (error) {
      throw createHttpError.BadRequest(customOptions?.customMessage ?? 'Error eliminando recurso')
    }
  }

  public async regexFilter(filters: FilterQuery<T>) {
    const escapeStringRegexp = (await import('escape-string-regexp')).default
    return Object.entries(filters).reduce((acc: Record<string, any>, [key, value]) => {
      acc[key] = { $regex: escapeStringRegexp(value as string) }
      return acc
    }, {})
  }
}
