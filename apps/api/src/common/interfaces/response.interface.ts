export interface ApiResponse<T, M = Record<string, unknown>> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: M;
  timestamp: string;
}
