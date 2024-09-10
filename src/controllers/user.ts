import { NextFunction, Request, Response } from 'express'
import { CommonController } from './common'
import { User } from '../models'
import { CommonRepository } from '../repositories'
import { UserInterface } from 'share/interfaces'
import { Tools } from '../classes'

export class UserController extends CommonController<UserInterface, CommonRepository<UserInterface>> {
  constructor() {
    super(new CommonRepository(User))
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.password = await new Tools().encrypt(req.body.password)
      return super.create(req, res, next)
    } catch (error) {
      next(error)
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.password = await new Tools().encrypt(req.body.password)
      return super.update(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}