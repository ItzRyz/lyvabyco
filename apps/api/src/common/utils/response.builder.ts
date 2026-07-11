import { ApiResponse } from '../interfaces/response.interface';

export class ResponseBuilder<T, M = Record<string, unknown>> {
  private success = true;
  private statusCode = 200;
  private message = 'Success';
  private data?: T;
  private meta?: M;

  setSuccess(success: boolean): this {
    this.success = success;
    return this;
  }

  setStatusCode(statusCode: number): this {
    this.statusCode = statusCode;
    return this;
  }

  setMessage(message: string): this {
    this.message = message;
    return this;
  }

  setData(data: T): this {
    this.data = data;
    return this;
  }

  setMeta(meta: M): this {
    this.meta = meta;
    return this;
  }

  build(): ApiResponse<T, M> {
    return {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      meta: this.meta,
      timestamp: new Date().toISOString(),
    };
  }
}
