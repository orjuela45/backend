import express from 'express'
import cors from 'cors'
import { connectDB } from './'
import routes from '../routes'
import { errorHandler } from '../middlewares'

export class Server {
  private app: express.Application
  private port: number

  constructor() {
    this.app = express()
    this.port = Number(process.env.PORT) || 8080

    this.middlewares()
    this.routes()
    this.dbConnect()
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
  }

  dbConnect() {
    connectDB()
      .then(() => console.log('Connected to MongoDB'))
      .catch((err) => console.log(err))
  }
}
