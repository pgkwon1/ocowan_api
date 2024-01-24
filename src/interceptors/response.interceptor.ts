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
    return next.handle().pipe(
      map((data) => {
        const result = statusCode >= 400 || data === false ? false : true;
        const message = result ? 'success' : 'error';
        return {
          data,
          result,
          message,
        };
      }),
    );
  }
}
