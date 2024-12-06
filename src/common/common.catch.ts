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
      data: null,
      message: '알 수 없는 오류가 발생하였습니다',
      result: false,
    });
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const { status: statusCode } = exception;
    response.status(statusCode).json({
      data: null,
      message: exception.message,
      result: false,
    });
  }
}
@Catch(TypeError)
export class TypeErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(500).json({
      data: null,
      message: '알 수 없는 오류가 발생하였습니다',
      result: false,
    });
  }
}
