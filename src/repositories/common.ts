import mongoose, { UpdateQuery } from 'mongoose'
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

  public async create(document: T, customMessage?: string) {
    try {
      const result = await this.model.create(document)
      return result
    } catch (error) {
      throw createHttpError.BadRequest(customMessage ?? 'Error creando recurso') 
    }
  }

  public async update(id: string, document: UpdateQuery<T>, customMessage?: string) {
    try {
      const result = await this.model.findByIdAndUpdate(id, document, { new: true })
      if (!result) throw createHttpError.NotFound('Recurso no encontrado')
      return result
    } catch (error) {
      throw createHttpError.BadRequest(customMessage ?? 'Error actualizando recurso')
    }
  }

  public async delete(id: string, customMessage?: string) {
    try {
      const result = await this.model.findByIdAndDelete(id)
      if (!result) throw createHttpError.NotFound('Recurso no encontrado')
      return result
    } catch (error) {
      throw createHttpError.BadRequest(customMessage ?? 'Error eliminando recurso')
    }
  }
}
