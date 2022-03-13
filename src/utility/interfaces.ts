export interface IErrorResponse {
  success: boolean;
  detail: string | null;
  message: string;
  error: string;
  timeStamp: string;
}

export interface ISuccessResponse<T> {
  success: boolean;
  detail: string | null;
  message: string;
  data: T;
  timeStamp: string;
}
