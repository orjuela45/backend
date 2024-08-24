import { describe, expect, it } from 'vitest'
import { Tools } from '../../src/classes'

describe('tools test', () => {
  const tools = new Tools()
  const stringOriginal = 'algo secreto'
  let stringEncrypted: string

  it('should encrypt string', () => {
    stringEncrypted = tools.encrypt(stringOriginal)
    expect(typeof stringEncrypted).toBe('string')
    expect(stringEncrypted).not.toBe(stringOriginal)
  })

  it('should decrypt string', () => {
    const decrypted = tools.decrypt(stringEncrypted)
    console.log(decrypted);
    expect(typeof decrypted).toBe('string')
    expect(decrypted).toBe(stringOriginal)
  })

  it('should compare hash', () => {
    expect(tools.compareHash(stringOriginal, stringEncrypted)).toBe(true)
  })

  it('should not compare hash', () => {
    expect(tools.compareHash('algo', stringEncrypted)).toBe(false)
  })
})
