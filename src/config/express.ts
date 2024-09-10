import express from 'express'
import cors from 'cors'
import createHttpError from 'http-errors';
import { connectDB } from './'
import routes from '../routes'
import { errorHandler } from '../middlewares'

export class Server {
  private app: express.Application
  private port: number

  constructor(testMode: boolean = false) {
    this.app = express()
    this.port = Number(process.env.PORT) || 8080

    this.middlewares()
    this.routes()
    this.dbConnect(testMode)
    this.app.use(errorHandler)
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`)
    })
  }

  middlewares() {
    this.app.use(express.static('public'))
    this.app.use(cors())
    this.app.use(express.json())
  }

  routes() {
    this.app.use('/api', routes)
    this.app.use((req, res, next) => {
      next(createHttpError(404, 'Ruta no encontrada'));
    });
  }

  dbConnect(testMode: boolean) {
    connectDB(testMode)
      .then(() => console.log(`Connected to MongoDB in ${testMode ? 'test' : 'production'} mode`))
      .catch((err) => console.log(err))
  }

  getApp(): express.Application {
    return this.app;
  }
}
