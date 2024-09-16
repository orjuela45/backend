import { Tools } from "../../src/classes";

export const userSeed = {
  name: 'Miguel',
  email: 'miguel@gmail.com',
  password: new Tools().encrypt('1234567890')
}
