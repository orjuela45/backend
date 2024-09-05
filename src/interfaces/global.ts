import { UserInterface } from "share/interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: UserInterface
    }
  }
}