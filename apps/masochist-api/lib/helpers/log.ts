import * as Sentry from '@sentry/node';

/* eslint-disable no-console */
export const log = {
  INFO: (content: string): void => {
    console.info(`${new Date().toLocaleString()} - [INFO] - ${content}`);
  },
  WARN: (content: string): void => {
    console.warn(`${new Date().toLocaleString()} - [WARN] - ${content}`);
  },
  DEBUG: (content: string): void => {
    console.trace(`${new Date().toLocaleString()} - [DEBUG] - ${content}`);
  },
  ERROR: (error: unknown, args?: Record<string, string>): void => {
    console.error(`${new Date().toLocaleString()} - [ERROR]`);
    console.error(error);

    const context: Record<string, any> = {};

    for (const key in args) {
      context[key] = args[key];
    }

    Sentry.setContext('context', context);
    Sentry.captureException(error);
  },
};
