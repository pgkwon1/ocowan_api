import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { AxiosError } from 'axios';

@Catch(AxiosError)
export class AxiosErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(500).json({
      statusCode: 500,
      message: '알 수 없는 오류가 발생하였습니다.',
    });
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const { status: statusCode } = exception;
    response.status(statusCode).json({
      result: false,
      statusCode,
      message: exception.message,
    });
  }
}
@Catch(TypeError)
export class TypeErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(500).json({
      statusCode: 500,
      message: '알 수 없는 오류가 발생하였습니다.',
    });
  }
}
