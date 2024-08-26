import { v4 as uuidv4 } from "uuid";

export const testModelFixture = {
  _id: uuidv4(),
  name: 'testName',
  email: 'testEmail',
  password: 'testPassword',
}

export const testModelUpdatedFixture = {
  name: 'testNameUpdated',
}