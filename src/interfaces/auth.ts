export interface TokenInterface {
  id: number,
}

declare global {
  namespace Express {
    interface Request {
      id: number
    }
  }
}