import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const { statusCode } = context.switchToHttp().getResponse().statusCode;
    const result = statusCode >= 400 ? false : true;
    const message = result ? 'success' : 'error';
    return next.handle().pipe(
      map((data) => ({
        result,
        message,
        data,
      })),
    );
  }
}
