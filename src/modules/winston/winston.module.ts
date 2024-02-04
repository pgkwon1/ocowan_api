import { Module } from '@nestjs/common';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike(),
          ),
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike(),
          ),
          level: 'error',
          filename: 'log/error/error.log',
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike(),
          ),
          level: 'info',
          filename: 'log/info/info.log',
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike(),
          ),
          level: 'warn',
          filename: 'log/warn/warn.log',
        }),

        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike(),
          ),
          level: 'http',
          filename: 'log/request/request.log',
        }),
      ],
    }),
  ],
  exports: [WinstonModule],
})
export class LoggerModule {}
