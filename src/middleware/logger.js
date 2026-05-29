import pino from 'pino-http';

const isDevelopment =
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export const logger = pino(
  isDevelopment
    ? {
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
            messageFormat:
              '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
            hideObject: true,
          },
        },
      }
    : {},
);
