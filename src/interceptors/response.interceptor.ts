import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable, map } from 'rxjs';
import { Logger } from 'winston';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const { statusCode } = context.switchToHttp().getResponse().statusCode;
    const request = context.switchToHttp().getRequest();
    this.logger.http(
      `request => url : ${request.url} method : ${request.method}`,
    );
    /* 응답 인터셉터 구간 */
    return next.handle().pipe(
      map((data) => {
        const result = statusCode >= 400 || data === false ? false : true;
        const message = result ? 'success' : 'error';

        this.logger.log(
          'http',
          `response => \nresult : ${result}, message : ${message} code: ${statusCode} `,
        );
        return {
          data,
          result,
          message,
        };
      }),
    );
  }
}
