import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    const { status: statusCode, message } = exception;
    const errorMessage = `(HttpExceptionFilter) 예외 메시지 ${message} http request 경로: ${request.url}
    ${exception.stack}`;
    this.logger.error('요청 예외 발생', {
      timeStamp: new Date().toISOString(),
      statusCode: 500,
      errorMessage,
    });

    response.status(statusCode).json({
      data: null,
      message,

      result: false,
    });
  }
}
@Catch(AxiosError, TypeError)
export class TypeErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    const errorMessage = `(TypeErrorFilter) ${exception instanceof AxiosError ? 'Axios 에러' : '문법 에러'} 예외 메시지 ${exception.message} http request 경로: ${request.url}`;

    this.logger.error('문법 예외 발생', {
      timeStamp: new Date().toISOString(),
      statusCode: 500,
      errorMessage,
    });
    response.status(500).json({
      data: null,
      message: '알 수 없는 오류가 발생하였습니다',
      result: false,
    });
  }
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    const errorMessage = `(AllExceptionFilter) : 예외 메시지 ${exception.message} http request 경로: ${request.url}`;

    this.logger.error('문법 예외 발생', {
      timeStamp: new Date().toISOString(),
      statusCode: 500,
      errorMessage,
    });
    response.status(500).json({
      data: null,
      message: '알 수 없는 오류가 발생하였습니다',
      result: false,
    });
  }
}
