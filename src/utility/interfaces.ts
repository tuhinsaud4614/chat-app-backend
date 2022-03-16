export interface IErrorResponse {
  success: boolean;
  detail: string | null;
  message: string;
  error: string;
  timeStamp: string;
}

export interface ISuccessResponse {
  success: boolean;
  detail: string | null;
  message: string;
  data: any;
  timeStamp: string;
}

export interface IOmitUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatar: string | null;
}
