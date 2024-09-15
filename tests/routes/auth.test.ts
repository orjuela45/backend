import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Server } from '../../src/config'
import { dbDisconnect } from '../../src/config'
import { userSeed } from '../fixtures'
import { User } from '../../src/models'

describe('test auth module', () => {
  const server = new Server(true)
  const api = '/api/auth/login'

  beforeAll(async () => {
    await User.create(userSeed)
    const user = await User.find({
      email: 'miguel@gmail.com',
      password: '1234567890',
    })
    console.log(user);
  })

  afterAll(async () => {
    await dbDisconnect()
  })

  it('should get error if email not sent', async () => {
    const response = await request(server.getApp()).post(api).send({})
    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: {
        message: 'El email es requerido.',
        status: 400,
        name: 'BadRequestError',
      },
    })
  })

  it('should get error if email is not valid', async () => {
    const response = await request(server.getApp()).post(api).send({ email: 'test' })
    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: {
        message: 'El formato del email no es válido.',
        status: 400,
        name: 'BadRequestError',
      },
    })
  })

  it('should get error if password not sent', async () => {
    const response = await request(server.getApp()).post(api).send({ email: 'lV5zK@example.com' })
    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: {
        message: 'La contraseña es requerida.',
        status: 400,
        name: 'BadRequestError',
      },
    })
  })

  it('should get error if credentials not match', async () => {
    const response = await request(server.getApp())
      .post(api)
      .send({ email: 'lV5zK@example.com', password: '1234567' })
    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({
      error: {
        message: 'Usuario no encontrado con esas credenciales',
        status: 404,
        name: 'NotFoundError',
      },
    })
  })

  it('should get token', async () => {
    const response = await request(server.getApp()).post(api).send({
      email: 'miguel@gmail.com',
      password: '1234567890',
    })
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      token: expect.any(String),
    })
  })
})
