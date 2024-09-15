import createHttpError from 'http-errors'
import { Jwt } from "./jwt";
import { CommonRepository } from "../repositories";
import { UserInterface } from 'share/interfaces';
import { User } from "../models";

export class Auth {
  private jwt: Jwt
  private userRepository: CommonRepository<UserInterface>
  constructor() {
    this.jwt = new Jwt()
    this.userRepository = new CommonRepository(User)
  }

  async login(email: string, password: string) {
    if (!email) throw createHttpError.BadRequest('Email no recibido')
    if (!password) throw createHttpError.BadRequest('Password no recibido')
    
    const user = await this.userRepository.getOneByFiltes({ email, password }, { customMessage: 'Usuario no encontrado con esas credenciales' })
    return this.jwt.generateToken(user?.id)
  }
}