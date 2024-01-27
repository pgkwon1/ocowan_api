import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AxiosErrorFilter, TypeErrorFilter } from './common/common.catch';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AxiosErrorFilter());
  app.useGlobalFilters(new TypeErrorFilter());
  await app.listen(3001);
}
bootstrap();
