import express from 'express'
import cors from 'cors'
import routes from '../routes'

export class Server {
  private app: express.Application
  private port: number

  constructor() {
    this.app = express()
    this.port = Number(process.env.PORT) || 8080
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

  routes(){
    this.app.use('/api', routes)
  }
}