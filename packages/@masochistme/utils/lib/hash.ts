import CryptoJS from 'crypto-js';
import crypto from 'crypto';

export const sha256 = (msg: string): string => CryptoJS.SHA256(msg).toString();

export const hash = (type: string, data: unknown) =>
  crypto.createHash(type).update(stringify(data)).digest('hex');

const stringify = (data: unknown) => {
  if (data == null || data == undefined) {
    return '';
  }
  if (typeof data === 'string') {
    return data;
  }
  if (typeof data === 'object') {
    return JSON.stringify(data);
  }
  return data.toString();
};
