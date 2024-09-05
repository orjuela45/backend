import { v4 as uuidv4 } from 'uuid'
import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest'
import createHttpError from 'http-errors'
import { dbConnect, dbDisconnect } from '../setupDBTest'
import { testModel, seedTestModel } from '../fixtures'
import { CommonController } from '../../src/controllers'
import { CommonRepository } from '../../src/repositories'
import { Request } from 'express'

describe('test common controller', () => {
  let testController: CommonController<any, CommonRepository<any>>
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
  const next = vi.fn()

  beforeAll(async () => {
    await dbConnect()
    testController = new CommonController(new CommonRepository(testModel))
    await testModel.deleteMany({})
    await testModel.create(seedTestModel)
  })

  afterAll(async () => {
    await dbDisconnect()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get a test document by id', async () => {
    const req = { params: { id: seedTestModel[0]._id } } as any
    await testController.getOneById(req, res, next)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(seedTestModel[0]))
    expect(next).not.toHaveBeenCalled()
  })

  it('should get an error if id not found', async () => {
    const req = { params: { id: uuidv4() } } as any
    await testController.getOneById(req, res, next)
    expect(next).toHaveBeenCalledWith(createHttpError.NotFound('Recurso no encontrado'))
  })

  it('should get error if id not specified', async () => {
    const req = { params: {} } as any
    await testController.getOneById(req, res, next)
    expect(next).toHaveBeenCalledWith(createHttpError.BadRequest('Id no recibido'))
  })

  it('should get all test documents', async () => {
    const req = { query: {} } as any
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
    await testController.getAll(req, res, next)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      data: expect.any(Array),
      total: 15,
      totalPages: 8,
      currentPage: 2,
      limit: 2,
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should get 2 test documents with exact match filters', async () => {
    const req = { body: { name: 'Louis' }, query: {}, url: '' } as Request
    await testController.getAll(req, res, next)
    const filteredResults = seedTestModel
    .filter(item => item.name === 'Louis')
    .map(item => ({
      _id: item._id,
      email: item.email,
      name: item.name,
      password: item.password
    }));
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.arrayContaining(filteredResults.map(expected => expect.objectContaining(expected))))
    expect(next).not.toHaveBeenCalled()
  })

  it('should get 2 test documents with exact match filters and pagination', async () => {
    const req = { body: { name: 'Louis' }, query: { limit : 1, page: 1}, url: '' } as any
    await testController.getAll(req, res, next)
    const filteredResults = seedTestModel
    .filter(item => item.name === 'Louis')
    .map(item => ({
      _id: item._id,
      email: item.email,
      name: item.name,
      password: item.password
    }));
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      data: expect.arrayContaining([filteredResults.map(expected => expect.objectContaining(expected))[1]]),
      total: 2,
      totalPages: 2,
      currentPage: 1,
      limit: 1
    })
    expect(next).not.toHaveBeenCalled()
  })

  // TODO: crear uno para obtener por filtros tipo like

  // TODO: crear uno para obtener por filtros tipo like con paginacion

  // TODO: crear uno para crear un nuevo documento

  // TODO: crear uno para crear varios nuevos documentos

  // TODO: crear uno para actualizar un documento

  // TODO: crear uno para eliminar un documento
})
