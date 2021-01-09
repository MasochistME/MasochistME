export const log = {
  INFO: (content: string): void =>
    console.log(`${new Date().toLocaleString()} - [INFO] - ${content}`),
  WARN: (content: string): void =>
    console.trace(`${new Date().toLocaleString()} - [WARN] - ${content}`),
  DEBUG: (content: string): void =>
    console.trace(`${new Date().toLocaleString()} - [DEBUG] - ${content}`),
};
