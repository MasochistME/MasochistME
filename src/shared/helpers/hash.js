import CryptoJS from 'crypto-js'

export const sha256 = msg => CryptoJS.SHA256(msg).toString()