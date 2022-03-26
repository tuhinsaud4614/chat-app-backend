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
  avatar: IExtendedImage | null;
  role: string;
}

export interface IImage {
  originalName: string;
  webpName: string;
  originalUrl: string;
  webpUrl: string;
  width: number;
  height: number;
}

export interface IExtendedImage {
  main: IImage;
  640: IImage;
  750: IImage;
  828: IImage;
  1080: IImage;
  1200: IImage;
  1920: IImage;
  2048: IImage;
  3840: IImage;
  parentDir: string;
}
