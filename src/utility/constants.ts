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

export const AUDIO_MIMES = {
  "audio/aac": "aac",
  "audio/mpeg": "mp3",
  "audio/wav": ".wav",
  "audio/webm": ".weba",
} as const;

export const VIDEO_MIMES = {
  "video/x-msvideo": "avi",
  "video/mp4": "mp4",
  "video/mpeg": "mpeg",
  "video/webm": "webm",
} as const;

export const DOCUMENT_MIMES = {
  "application/zip": "zip",
  "application/x-7z-compressed": "7z",
  "application/x-tar": "tar",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/msword": "doc",
  "text/csv": "csv",
  "text/plain": "txt",
} as const;

export const USER_POPULATE_SELECT =
  "_id firstName lastName email avatar role active";

export const USER_PROJECT_SELECT = (refKey: string) => {
  return {
    [`${refKey}._id`]: 1,
    [`${refKey}.firstName`]: 1,
    [`${refKey}.lastName`]: 1,
    [`${refKey}.email`]: 1,
    [`${refKey}.avatar`]: 1,
    [`${refKey}.role`]: 1,
    [`${refKey}.active`]: 1,
  };
};

export const CONVERSATION_PROJECT_SELECT = (
  refKey: string,
  participants?: boolean
) => {
  const obj = {
    [`${refKey}._id`]: 1,
    [`${refKey}.isGroup`]: 1,
    [`${refKey}.name`]: 1,
  };
  if (participants) {
    return { ...obj, [`${refKey}.participants`]: 1 };
  }
  return obj;
};
