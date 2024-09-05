import { v4 as uuidv4 } from 'uuid'
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import createHttpError from 'http-errors'
import { dbConnect, dbDisconnect } from '../setupDBTest'
import { testModel, testModelFixture, seedTestModel } from '../fixtures'
import { CommonController } from '../../src/controllers'
import { CommonRepository } from '../../src/repositories'

describe('test common repository', () => {
  let testController: CommonController<any, CommonRepository<any>>

  beforeAll(async () => {
    await dbConnect()
    testController = new CommonController(new CommonRepository(testModel))
    await testModel.deleteMany({})
    await testModel.create(seedTestModel)
  })

  afterAll(async () => {
    await dbDisconnect()
  })

  it('should get a test document by id', async () => {
    const req = { params: { id: seedTestModel[0]._id } } as any
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
    const next = vi.fn()
    await testController.getOneById(req, res, next)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(seedTestModel[0]))
    expect(next).not.toHaveBeenCalled()
  })

  it('should get an error if id not found', async () => {
    const req = { params: { id: uuidv4() } } as any
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
    const next = vi.fn()
    await testController.getOneById(req, res, next)
    expect(next).toHaveBeenCalledWith(createHttpError.NotFound('Recurso no encontrado'))
  })

  it('should get error if id not specified', async () => {
    const req = { params: {} } as any
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
    const next = vi.fn()
    await testController.getOneById(req, res, next)
    expect(next).toHaveBeenCalledWith(createHttpError.BadRequest('Id no recibido'))
  })

  it('should get all test documents', async () => {
    const req = { query: {} } as any
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
    const next = vi.fn()
    await testController.getAll(req, res, next)
    const sanitizedResponse = res.json.mock.calls[0][0].map((item: any) => {
      const { createdAt, updatedAt, __v, ...rest } = item;
      return rest;
    });
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(sanitizedResponse))
    expect(next).not.toHaveBeenCalled()
  })

  it('should get all test document with pagination', async () => {
    const req = { query: { limit: 2, page: 2 } } as any
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
    const next = vi.fn()
    await testController.getAll(req, res, next)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          _id: seedTestModel[1]._id,
          email: seedTestModel[1].email,
          name: seedTestModel[1].name,
          password: seedTestModel[1].password,
        }),
        expect.objectContaining({
          _id: seedTestModel[2]._id,
          email: seedTestModel[2].email,
          name: seedTestModel[2].name,
          password: seedTestModel[2].password,
        })
      ],
      total: 15,
      totalPages: 8,
      currentPage: 2,
      limit: 2,
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should get ', async () => {
    
  })

  // TODO: crear uno para obtener por filtros especificos

  // TODO: crear uno para obtener por filtros especificos con paginacion

  // TODO: crear uno para obtener por filtros tipo like

  // TODO: crear uno para obtener por filtros tipo like con paginacion

  // TODO: crear uno para crear un nuevo documento

  // TODO: crear uno para crear varios nuevos documentos

  // TODO: crear uno para actualizar un documento

  // TODO: crear uno para eliminar un documento
})
