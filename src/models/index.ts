import { IErrorResponse, ISuccessResponse } from "../utility";

export class HttpError extends Error {
  constructor(message: string, public code: number, public detail?: string) {
    super(message);

    // this is for instanceof behave properly
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  private _checkError(code: number) {
    switch (code) {
      case 301:
        return "Moved Permanently";
      case 400:
        return "Bad Request";
      case 401:
        return "Unauthorized";
      case 402:
        return "Payment Required";
      case 403:
        return "Forbidden";
      case 404:
        return "Not Found";
      case 409:
        return "Conflict";
      case 415:
        // The request entity has a media type which the server or resource does not support. For example, the client uploads an image as image/svg+xml, but the server requires that images use a different format.[49]
        return "Unsupported Media Type";
      case 422:
        // Invalid Inputs
        return "Unprocessable Entity";
      case 429:
        return "Too Many Requests";
      case 431:
        return "Request Header Fields Too Large";
      case 500:
        return "Internal Server Error";
      default:
        return "An unknown error occurred";
    }
  }

  toObj(): IErrorResponse {
    return {
      success: this.code >= 301 && this.code <= 500 ? false : true,
      detail: this.detail || null,
      message: this.message,
      error: this._checkError(this.code),
      timeStamp: new Date().toISOString(),
    };
  }
}

export class HttpSuccess {
  constructor(
    public message: string,
    public data: any,
    public detail: string | null = null
  ) {}

  toObj(): ISuccessResponse {
    return {
      data: this.data,
      detail: this.detail,
      message: this.message,
      success: true,
      timeStamp: new Date().toISOString(),
    };
  }
}
