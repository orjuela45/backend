import { NextFunction, Request, Response } from 'express'
import { CommonRepository } from '../repositories'
import createHttpError from "http-errors";

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
      return res.status(200).json(await this.repository.getAll())
    } catch (error) {
      next(error)
    }
  }
}
