import { UserInterface } from "share/interfaces";

declare global {
  namespace Express {
    interface Request {
      id?: string
      user?: UserInterface
    }
  }
}