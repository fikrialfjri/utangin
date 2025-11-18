export interface BaseResponse<T> {
  message: string;
  data?: T | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}
