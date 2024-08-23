import { NextFunction, Request, Response } from 'express'
import { CommonRepository } from '../repositories'

export class CommonController<T, R extends CommonRepository<T>> {
  repository: R

  constructor(repository: R) {
    this.repository = repository
  }

  getOneById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      res.json(await this.repository.getOneById(id))
      return
    } catch (error) {
      next(error)
    }
  }
}
