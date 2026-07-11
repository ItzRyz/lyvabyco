import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';
import { ZodError } from 'zod';
import { ResponseBuilder } from '../utils/response.builder';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: string[] | null = null;

    if (exception instanceof ZodValidationException) {
      status = exception.getStatus();
      message = 'Validation failed';

      const rawError: unknown = exception.getZodError();

      if (rawError instanceof ZodError) {
        errors = rawError.issues.map(
          (err) => `${err.path.join('.')}: ${err.message}`,
        );
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resContent = exception.getResponse() as
        | Record<string, unknown>
        | string;
      message =
        typeof resContent === 'object'
          ? (resContent.message as string) || exception.message
          : resContent;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const meta: Record<string, unknown> = errors ? { errors } : {};

    const errorResponse = new ResponseBuilder<null, Record<string, unknown>>()
      .setSuccess(false)
      .setStatusCode(status)
      .setMessage(message)
      .setData(null)
      .setMeta(meta)
      .build();

    response.status(status).json(errorResponse);
  }
}
