import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export const testModel = mongoose.model(
  'test',
  new mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true },
      password: String,
      _id: {
        type: String,
        default: uuidv4(),
      },
    },
    { timestamps: true },
  ),
)

export const testModelFixture = {
  _id: uuidv4(),
  name: 'miguel',
  email: 'miguel.orjuela45@gmail.com',
  password: '1234567890',
}

export const seedTestModel = [
  {
    _id: uuidv4(),
    name: 'Cody',
    email: 'ti@motepwe.mh',
    password: 'u1dH7i4URWVHMtVlwQ',
  },
  {
    _id: uuidv4(),
    name: 'Bernard',
    email: 'siropep@gmail.com',
    password: 'A2kY3',
  },
  {
    _id: uuidv4(),
    name: 'Louis',
    email: 'fahankos@cudwe.bi',
    password: 'ud7wsvpFp17aPzU',
  },
  {
    _id: uuidv4(),
    name: 'Lou',
    email: 'sakov@evuduv.ws',
    password: 'WnOhVHF9dS0xJS',
  },
  {
    _id: uuidv4(),
    name: 'Vernon',
    email: 'akiascaz@riraw.kg',
    password: 'NZ3gBJ',
  },
  {
    _id: uuidv4(),
    name: 'Nathaniel',
    email: 'ogorealu@po.ma',
    password: 'Fx71oeasN0H63UP',
  },
  {
    _id: uuidv4(),
    name: 'Glenn',
    email: 'jara@co.gr',
    password: 'WB9UNm',
  },
  {
    _id: uuidv4(),
    name: 'Randall',
    email: 'nu@gmail.com',
    password: 'KFXcdWilGDzYDYgWCQq9',
  },
  {
    _id: uuidv4(),
    name: 'Bettie',
    email: 'fi@hegante.ni',
    password: 'gaC8HsbZLfu',
  },
  {
    _id: uuidv4(),
    name: 'Helena',
    email: 'kikazcoj@gmail.com',
    password: '54I2Zoti',
  },
  {
    _id: uuidv4(),
    name: 'Louis',
    email: 'fo@saf.sa',
    password: 'uw2TQwmx8hp',
  },
  {
    _id: uuidv4(),
    name: 'Luis',
    email: 'cifo@ufuuf.eh',
    password: 'Fe9rehq9vq2OjpeFPP',
  },
  {
    _id: uuidv4(),
    name: 'Caleb',
    email: 'ti@ukuipne.pl',
    password: '5qz1kR3e',
  },
  {
    _id: uuidv4(),
    name: 'Albert',
    email: 'lupneeci@gmail.com',
    password: 'm3XYRKhVdnbz3oW5U33P',
  },
  {
    _id: uuidv4(),
    name: 'Mable',
    email: 'ho@bujap.bh',
    password: 'n4qrRCq',
  },
]