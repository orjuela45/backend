import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { dbConnect, dbDisconnect } from '../setupDBTest'
import { CommonRepository } from '../../src/repositories'
import { testModelFixture, testModelUpdatedFixture } from '../fixtures'

describe('test common repository', () => {
  let testModel: mongoose.Model<any>
  let testRepository: CommonRepository<any>

  beforeAll(async () => {
    await dbConnect()
    testModel = mongoose.model(
      'test',
      new mongoose.Schema({ 
        name: String, 
        email: {type: String, unique: true}, 
        password: String, 
        _id: {
          type: String,
          default: uuidv4()
        }
      }, { timestamps: true }),
    )

    testRepository = new CommonRepository(testModel)
  })

  afterAll(async () => {
    await dbDisconnect()
  })

  it('should create a test document', async () => {
    const test = await testRepository.create(testModelFixture)
    expect(test).toBeDefined()
  })

  it('should get a test document', async () => {
    const test = await testRepository.getOneById(testModelFixture._id)
    expect(test).toBeDefined()
    expect(test).toMatchObject(testModelFixture)
  })

  it('should update a test document', async () => {
    const test = await testRepository.update(testModelFixture._id, testModelUpdatedFixture)
    expect(test).toBeDefined()
    expect(test).toMatchObject(testModelUpdatedFixture)
  })

  it('should delete a test document', async () => {
    const test = await testRepository.delete(testModelFixture._id)
    expect(test).toBeDefined()
    await expect(testRepository.getOneById(testModelFixture._id)).rejects.toThrow('Recurso no encontrado')
  })
  it('should get error if id not found', async () => {
    await expect(testRepository.getOneById(uuidv4())).rejects.toThrow('Recurso no encontrado')
  })

})
