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
    console.log(res.status)
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
})
