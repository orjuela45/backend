import mongoose from 'mongoose'
import { v4 as uuidv4 } from "uuid";
import { UserInterface } from 'share/interfaces'

const userSchema = new mongoose.Schema<UserInterface>({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {timestamps: true})

export const User = mongoose.model('User', userSchema)
