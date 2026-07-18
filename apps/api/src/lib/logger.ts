import winston from 'winston';

const { combine, timestamp, json, errors, colorize, simple } = winston.format;

const isDev = process.env['NODE_ENV'] !== 'production';

export const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    json(),
  ),
  defaultMeta: {
    service: 'satmss-api',
    environment: process.env['NODE_ENV'] ?? 'development',
  },
  transports: [
    new winston.transports.Console({
      format: isDev ? combine(colorize(), simple()) : combine(timestamp(), json()),
    }),
  ],
});
