import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Auth } from "../../src/classes";
import { connectDB, dbDisconnect } from "../../src/config";
import { User } from "../../src/models";
import { userSeed } from "../fixtures";

describe("test Auth", () => {
  const auth = new Auth()

  beforeAll(async () => {
    await connectDB(true)
    await User.deleteMany({})
    await User.create(userSeed)
  })

  afterAll(async () => {
    await dbDisconnect()
  })

  it("should get error if email not sent", async () => {
    await expect((auth.login as any)).rejects.toThrowError("Email no recibido")
  })

  it("should get error if password not sent", async () => {
    await expect((auth.login as any)('miguel@gmail.com')).rejects.toThrowError("Password no recibido")
  })
  
  it("should get error because user not found", async() => {
    await expect(auth.login('miguelorjuela@gmail.com', '1234567890')).rejects.toThrowError("Usuario no encontrado con esas credenciales")
  })

  it("should get token because user found", async () => {
    const token = await auth.login('miguel@gmail.com', '1234567890')
    expect(token).toBeDefined()
  })

})