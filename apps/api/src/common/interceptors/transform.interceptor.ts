import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseBuilder } from '../utils/response.builder';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: T) => {
        if (data && Object.prototype.hasOwnProperty.call(data, 'success')) {
          return data as unknown as ApiResponse<T>;
        }

        return new ResponseBuilder<T>()
          .setStatusCode(statusCode)
          .setSuccess(statusCode >= 200 && statusCode < 300)
          .setMessage('Request handled successfully')
          .setData(data)
          .build();
      }),
    );
  }
}
