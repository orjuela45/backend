import { type NextFunction, type Request, type Response } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  res.status(err.status ?? 500);
  res.json({
    error: {
      name: err.name ?? 'Error',
      status: err.status ?? 500,
      message: err.message,
    },
  });
}