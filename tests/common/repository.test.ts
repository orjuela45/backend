import { v4 as uuidv4 } from 'uuid'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { dbConnect, dbDisconnect } from '../setupDBTest'
import { CommonRepository } from '../../src/repositories'
import { testModel, seedTestModel, testModelFixture} from '../fixtures'

describe('test common repository', () => {
  let testRepository: CommonRepository<any>

  beforeAll(async () => {
    await dbConnect()
    testRepository = new CommonRepository(testModel)
    await testModel.deleteMany({})
    await testModel.create(seedTestModel)
  })

  afterAll(async () => {
    await dbDisconnect()
  })

  it('should create a test document', async () => {
    const test = await testRepository.create(testModelFixture)
    expect(test).toBeDefined()
  })

  it('should get a test document by id', async () => {
    const test = await testRepository.getOneById(testModelFixture._id)
    expect(test).toBeDefined()
    expect(test).toMatchObject(testModelFixture)
  })

  it('should get all test documents', async () => {
    const tests = await testRepository.getAll()
    expect(tests).toBeDefined()
    expect(tests.length).toBeGreaterThan(0)
  })

  it('should get all test documents with pagination', async () => {
    const page = 0, limit = 5
    const tests = await testRepository.getAllWithPagination({ limit, page })
    expect(tests).toBeDefined()
    expect(tests.currentPage).toBe(page)
    expect(tests.limit).toBe(limit)
    expect(tests.data.length).toBe(limit)
    expect(tests.data[0]).toMatchObject(seedTestModel[0])
    expect(tests.data[5]).not.toBeDefined()
  })

  it('should update a test document', async () => {
    const newTest = { ...testModelFixture, name: 'Updated test' }
    const test = await testRepository.update(testModelFixture._id, newTest)
    expect(test).toBeDefined()
    expect(test).toMatchObject(newTest)
  })

  it('should delete a test document', async () => {
    const test = await testRepository.delete(testModelFixture._id)
    expect(test).toBeDefined()
    await expect(testRepository.getOneById(testModelFixture._id)).rejects.toThrow('Recurso no encontrado')
  })
  it('should get error if id not found', async () => {
    await expect(testRepository.getOneById(uuidv4())).rejects.toThrow('Recurso no encontrado')
  })

  // TODO: Implementar test para filtros tipo like

})
