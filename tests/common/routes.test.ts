import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Server } from '../../src/config'
import { dbDisconnect } from '../../src/config'
import { seedTestModel, testModel } from '../fixtures'
import { Jwt } from '../../src/classes'

describe('test routes', () => {
  const server = new Server(true)
  beforeAll(async () => {
    await testModel.deleteMany({})
    await testModel.create(seedTestModel)
  })

  afterAll(async () => {
    await dbDisconnect()
  })

  it('should get error if path not found', async () => {
    const response = await request(server.getApp()).get('/path/no/existe')
    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({error: {
      message: 'Ruta no encontrada',
      status: 404,
      name: 'NotFoundError',
    }})
  })

  it('should get message path test', async () => {
    const response = await request(server.getApp()).get('/api/test')
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({msg: 'Ruta en prueba'})
  })

  it('should get error because token not sent', async () => {
    const response = await request(server.getApp()).get('/api/testToken')
    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({error: {
      message: 'Token no recibido',
      status: 400,
      name: 'BadRequestError',
    }})
  })

  it('should get error because token not valid', async () => {
    const response = await request(server.getApp()).get('/api/testToken').set('x-auth-token', 'invalid token')
    expect(response.status).toBe(500)
    expect(response.body).toMatchObject({error: {
      message: 'Error leyendo JWT',
      status: 500,
      name: 'InternalServerError',
    }})
  })

  it('should get message path test Token', async () => {
    const token = new Jwt().generateToken(1)
    const response = await request(server.getApp()).get('/api/testToken').set('x-auth-token', token)
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({msg: 'Ruta en prueba con token'})
  })

})
