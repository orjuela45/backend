import mongoose from 'mongoose'
import createHttpError from 'http-errors'

export class CommonRepository<T> {
  public model = mongoose.Model
  constructor(model: mongoose.Model<T>) {
    this.model = model
  }

  public async getOneById(id: string) {
    const result = await this.model.findById(id)
    if (!result) throw createHttpError.NotFound('Recurso no encontrado')
    return result
  }
}
