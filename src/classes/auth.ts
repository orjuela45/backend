import createHttpError from 'http-errors'
import { Jwt } from "./jwt";
import { CommonRepository } from "../repositories";
import { UserInterface } from 'share/interfaces';
import { User } from "../models";
import { Tools } from './tools';

export class Auth {
  private jwt: Jwt
  private tools: Tools
  private userRepository: CommonRepository<UserInterface>
  constructor() {
    this.jwt = new Jwt()
    this.tools = new Tools()
    this.userRepository = new CommonRepository(User)
  }

  async login(email: string, password: string) {
    if (!email) throw createHttpError.BadRequest('Email no recibido')
    if (!password) throw createHttpError.BadRequest('Password no recibido')
    
    const user = await this.userRepository.getOneByFiltes({ email }, { customMessage: 'Email no registrado' })
    if (!this.tools.compareHash(password, user?.password)) throw createHttpError.Unauthorized('Credenciales incorrectas')
    return this.jwt.generateToken(user?.id)
  }
}