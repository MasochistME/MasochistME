import CryptoJS from 'crypto-js';

export const sha256 = (msg: string): string => CryptoJS.SHA256(msg).toString();
