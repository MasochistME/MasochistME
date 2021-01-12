export const log = {
  INFO: content =>
    console.log(`${new Date().toLocaleString()} - [INFO] - ${content}`),
  WARN: content =>
    console.trace(`${new Date().toLocaleString()} - [WARN] - ${content}`),
  DEBUG: content =>
    console.log(`${new Date().toLocaleString()} - [DEBUG] - ${content}`),
};
