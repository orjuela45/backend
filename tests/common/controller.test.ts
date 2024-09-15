import { v4 as uuidv4 } from 'uuid'
import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest'
import createHttpError from 'http-errors'
import { connectDB, dbDisconnect } from '../../src/config'
import { testModel, seedTestModel, testModelFixture } from '../fixtures'
import { CommonController } from '../../src/controllers'
import { CommonRepository } from '../../src/repositories'
import { Request } from 'express'

describe('test common controller', () => {
  let testController: CommonController<any, CommonRepository<any>>
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any
  const next = vi.fn()

  beforeAll(async () => {
    await connectDB(true)
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

  it('should get 0 test documents with exact match filters', async () => {
    const req = { body: { name: 'Louiscarlos' }, query: {}, url: '' } as Request
    await testController.getAll(req, res, next)
    const filteredResults = seedTestModel
    .filter(item => item.name === 'Louiscarlos')
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

  it('should get test documents with partial match filters ', async () => {
    const req = { body: { email: '@gmail' }, query: { }, url: '/search' } as any
    await testController.getAll(req, res, next)
    const filteredResults = seedTestModel
    .filter(item => item.email.includes('gmail'))
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
  
  it('should get 0 test documents with partial match filters ', async () => {
    const req = { body: { email: '@gmailfjndksjlfs' }, query: { }, url: '/search' } as any
    await testController.getAll(req, res, next)
    const filteredResults = seedTestModel
    .filter(item => item.email.includes('gmailfjndksjlfs'))
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

  it('should get test documents with partial match filters and pagination', async () => {
    const page = 2, limit = 1
    const req = { body: { email: '@gmail' }, query: { limit, page}, url: '/search' } as any
    await testController.getAll(req, res, next)
    const filteredResults = seedTestModel
    .filter(item => item.email.includes('@gmail'))
    .map(item => ({
      _id: item._id,
      email: item.email,
      name: item.name,
      password: item.password
    }));
    const paginatedResults = filteredResults.slice((page - 1) * limit, page * limit);
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      data: expect.arrayContaining(paginatedResults.map(item => expect.objectContaining(item))),
      total: filteredResults.length,
      totalPages: Math.ceil(filteredResults.length / 1),
      currentPage: page,
      limit
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('should create a new test document', async () => {
    const req = { body: testModelFixture, query: {}, url: '' } as any
    await testController.create(req, res, next)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(testModelFixture))
    expect(next).not.toHaveBeenCalled()
  })

  it('should update a test document', async () => {
    const newTest = { ...testModelFixture, name: 'Updated test' }
    const req = { body: newTest, query: {}, url: '', params: {id: testModelFixture._id} } as any
    await testController.update(req, res, next)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(newTest))
    expect(next).not.toHaveBeenCalled()
  })

  it('should delete a test document', async () => {
    const req = { body: {}, query: {}, url: '', params: {id: seedTestModel[4]._id} } as any
    await testController.delete(req, res, next)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(seedTestModel[4]))
    expect(next).not.toHaveBeenCalled()
  })

  it('should get one test document with exact match filters', async () => {
    const req = { body: { name: 'Louis' }, query: {}, url: '' } as Request
    await testController.getOneByFilters(req, res, next)
    const filteredResults = seedTestModel
    .filter(item => item.name === 'Louis')
    .map(item => ({
      _id: item._id,
      email: item.email,
      name: item.name,
      password: item.password
    }));
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(filteredResults[0]))
    expect(next).not.toHaveBeenCalled()
  })

  it('should get error if test documents with exact match filters not found', async () => {
    const req = { body: { name: 'Louiscarlos' }, query: {}, url: '' } as Request
    await testController.getOneByFilters(req, res, next)
    expect(next).toHaveBeenCalledWith(createHttpError.NotFound('Recurso no encontrado'))
  })
  
  it('should get one test document with partial match filters', async () => {
    const req = { body: { name: 'Loui' }, query: {}, url: '/search' } as Request
    await testController.getOneByFilters(req, res, next)
    const filteredResults = seedTestModel
    .filter(item => item.name.includes('Loui'))
    .map(item => ({
      _id: item._id,
      email: item.email,
      name: item.name,
      password: item.password
    }));
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(filteredResults[0]))
    expect(next).not.toHaveBeenCalled()
  })

  it('should get error if test documents with partial match filters not found', async () => {
    const req = { body: { name: 'Louiscar' }, query: {}, url: '/search' } as Request
    await testController.getOneByFilters(req, res, next)
    expect(next).toHaveBeenCalledWith(createHttpError.NotFound('Recurso no encontrado'))
  })
})
