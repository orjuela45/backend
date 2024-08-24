import CryptoJS from 'crypto-js'

export class Tools {
  encrypt = (string: string) => {
    return CryptoJS.AES.encrypt(string, process.env.ENCRYPT_KEY! || 'secret').toString()
  }

  compareHash = (string: string, hash: string) => {
    return this.decrypt(hash) === string
  }

  decrypt = (encryptedString: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedString, process.env.ENCRYPT_KEY! || 'secret')
      return  bytes.toString(CryptoJS.enc.Utf8)
    } catch (error) {
      console.error('Error al descifrar la cadena:', error)
      return null
    }
  }
}
