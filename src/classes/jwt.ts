import createHttpError from 'http-errors'
import jsonwebtoken, { type JwtPayload } from 'jsonwebtoken'
export class Jwt {
  generateToken(id: number): string {
    try {
      const token = jsonwebtoken.sign({ id }, process.env.SECRET ?? 'SECRET', { expiresIn: '1d' })
      return token
    } catch (error) {
      throw createHttpError.InternalServerError('Error generando JWT')
    }
  }

  validateToken(token: string): JwtPayload {
    try {
      const tokenDecrypt = jsonwebtoken.verify(token, process.env.SECRET ?? 'SECRET')
      return tokenDecrypt as JwtPayload
    } catch (error) {
      throw createHttpError.InternalServerError('Error leyendo JWT')
    }
  }
}
