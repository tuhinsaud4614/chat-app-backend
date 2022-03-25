export const REFRESH_TOKEN_KEY_NAME = (id: string) => `REFRESH_TOKEN-${id}`;

export const USER_VERIFICATION_KEY_NAME = (id: string) =>
  `USER_VERIFICATION-${id}`;

export const USER_RESET_PASSWORD_KEY_NAME = (id: string) =>
  `USER_RESET_PASSWORD-${id}`;

export const USER_RESET_PASSWORD_VERIFIED_KEY_NAME = (id: string) =>
  `USER_RESET_PASSWORD_VERIFIED-${id}`;

export const maxFileSize = (mb: number) => mb * 1000000;

export const IMAGE_MIMES = {
  "image/gif": "gif",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export const IMAGE_BREAKPOINTS = [
  "main",
  640,
  750,
  828,
  1080,
  1200,
  1920,
  2048,
  3840,
] as const;
