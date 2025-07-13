import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { LoggerModule } from './modules/winston/winston.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      process.env.PRODUCTION_FRONT_URL,
      process.env.DEV_FRONT_URL,
      process.env.LOCAL_FRONT_URL,
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const winston = app.select(LoggerModule).get(WINSTON_MODULE_NEST_PROVIDER);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: false }));
  app.use(cookieParser());
  app.useLogger(winston);

  await app.listen(3001);
}
bootstrap();
