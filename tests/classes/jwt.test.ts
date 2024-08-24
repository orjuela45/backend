import { describe, expect, it } from "vitest";
import { Jwt } from "../../src/classes";

describe("test JWT", () => {
  const jwt = new Jwt()
  let currentToken: string

  it("should generate token", () => {
    currentToken = jwt.generateToken(1)
    expect(currentToken).toBeDefined()
  })

  it("should validate token", () => {
    const token = jwt.validateToken(currentToken)
    expect(token).toBeDefined()
  })

  it("should not validate token", () => {
    expect(() => {
      jwt.validateToken("invalid token")
    }).toThrow("Error leyendo JWT")
  })
})