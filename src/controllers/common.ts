import { NextFunction, Request, Response } from 'express'
import { CommonRepository } from '../repositories'
import createHttpError from "http-errors";
import { PaginationInterface } from '../interfaces';

export class CommonController<T, R extends CommonRepository<T>> {
  repository: R

  constructor(repository: R) {
    this.repository = repository
  }

  getOneById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      if (!id) throw createHttpError.BadRequest('Id no recibido')
      return res.status(200).json(await this.repository.getOneById(id))
    } catch (error) {
      next(error)
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, page }: PaginationInterface = req.query
      let filters = req.body
      if (filters && req.url.includes('search')) {
        filters = this.repository.regexFilter(filters)
      }
      if (limit || page) {
        return res.status(200).json(await this.repository.getAllWithPagination({limit, page}, filters))
      }
      return res.status(200).json(await this.repository.getAll(filters))
    } catch (error) {
      next(error)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(200).json(await this.repository.create(req.body))
    } catch (error) {
      next(error)
    }
  }
}
