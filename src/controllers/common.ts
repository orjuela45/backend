import { NextFunction, Request, Response } from 'express'
import createHttpError from "http-errors";
import { CommonRepository } from '../repositories'
import { PaginationInterface } from '../interfaces';

export class CommonController<T, R extends CommonRepository<T>> {
  repository: R

  constructor(repository: R) {
    this.repository = repository
  }

  public async getOneById(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params
      if (!id) throw createHttpError.BadRequest('Id no recibido') // todo como se repite esto en los otros metodos, puedo ponerlo como middleware joi
      return res.status(200).json(await this.repository.getOneById(id))
    } catch (error) {
      next(error)
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction){
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

  public async create(req: Request, res: Response, next: NextFunction){
    try {
      return res.status(201).json(await this.repository.create(req.body))
    } catch (error) {
      next(error)
    }
  }

  public async update(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params
      if (!id) throw createHttpError.BadRequest('Id no recibido')
      return res.status(200).json(await this.repository.update(id, req.body))
    } catch (error) {
      next(error)
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction){
    try {
      const { id } = req.params
      if (!id) throw createHttpError.BadRequest('Id no recibido')
      return res.status(200).json(await this.repository.delete(id))
    } catch (error) {
      next(error)
    }
  }

}
