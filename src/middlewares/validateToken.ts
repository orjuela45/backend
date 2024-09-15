import { type Request, type Response, type NextFunction } from 'express'
import createHttpError from 'http-errors';
import { Jwt } from '../classes'

export const validateToken = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  const httpToken: string | undefined = req.header('x-auth-token')
  try {
    if (httpToken == null) throw createHttpError.BadRequest("Token no recibido")
    let { id }: { id: string } = new Jwt().validateToken(httpToken) as {id: string}
    req.id = id
    next()
  } catch (error) {
    next(error)
  }
}