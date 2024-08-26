import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer: MongoMemoryServer

export const dbConnect = async () => {
  mongoServer = await MongoMemoryServer.create()

  const uri = mongoServer.getUri()

  await mongoose.connect(uri)
}

export const dbDisconnect = async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
}
