import { type NextFunction, type Request, type Response } from 'express'
import { type Schema, type ValidationError } from 'joi'
import createError from 'http-errors'

export const validationJoi = (joiSchema: Schema, typeMethod : string = 'body') => {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const data =
        typeMethod === 'params'
          ? req.params
          : typeMethod === 'query'
          ? req.query
          : req.body;
      joiSchema.validate(data, {context: {multipart: true}})
      next()
    } catch (error) {
      const validationError = error as ValidationError
      const customError = createError.BadRequest(validationError.message)
      next(customError)
    }
  }
}
