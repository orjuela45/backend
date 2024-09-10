import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer

export const connectDB = async (testMode = false) => {
  let uri: string = process.env.MONGO_URI!
  if (testMode) {
    mongoServer = await MongoMemoryServer.create()
    uri = mongoServer.getUri()
  }
  await mongoose.connect(uri)
}

export const dbDisconnect = async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
}
