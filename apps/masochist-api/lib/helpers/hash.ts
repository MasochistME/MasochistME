import crypto from 'crypto';

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

export const hash = (type: any, data: any) =>
  crypto.createHash(type).update(stringify(data)).digest('hex');
