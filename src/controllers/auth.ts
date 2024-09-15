import { NextFunction, Request, Response } from "express";
import { Auth } from "../classes";

export class AuthController {

  private authClass: Auth
  constructor() {
    this.authClass = new Auth()
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body
      const token = await this.authClass.login(email, password)
      return res.status(200).json({token})
    } catch (error) {
      next(error)
    }
  }
}