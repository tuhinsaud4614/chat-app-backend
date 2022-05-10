import del from "del";
import { existsSync } from "fs";
import path from "path";
import sharp, { FormatEnum } from "sharp";
import { AUDIO_MIMES, DOCUMENT_MIMES, VIDEO_MIMES } from "./constants";
import {
  AttachmentType,
  AUDIO_MIME_TYPE,
  DOCUMENT_MIME_TYPE,
  VIDEO_MIME_TYPE,
} from "./types";

export function trimmedObjValue<T extends Object>(obj: T) {
  if (typeof obj === "object") {
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        // @ts-ignore
        obj[key] = obj[key].trim();
      }
    }
  }

  return JSON.parse(JSON.stringify(obj)) as T;
}

export const resizeImage = async (
  baseName: string,
  imagePath:
    | Buffer
    | Uint8Array
    | Uint8ClampedArray
    | Int8Array
    | Uint16Array
    | Int16Array
    | Uint32Array
    | Int32Array
    | Float32Array
    | Float64Array
    | string,
  location: string,
  format: keyof FormatEnum,
  size: { width?: number; height?: number; baseName: string }
) => {
  const newName = `${baseName}${size.width ? `-${size.width}w` : ""}${
    size.height ? `x${size.height}h` : ""
  }`;

  const originalName = `${newName}.${format}`;
  const webpName = `${newName}.webp`;

  const [original] = await Promise.all([
    sharp(imagePath)
      .resize(size.width, size.height)
      .toFormat(format)
      .toFile(path.join(location, originalName)),
    sharp(imagePath)
      .resize(size.width, size.height)
      .webp()
      .toFile(path.join(location, webpName)),
  ]);

  return {
    originalName: originalName,
    webpName: webpName,
    originalUrl: `images/${baseName}/${originalName}`,
    webpUrl: `images/${baseName}/${webpName}`,
    width: original.width,
    height: original.height,
  };
};

export const removeDir = (location: string) => {
  if (existsSync(location)) {
    del.sync(location);
  }
};

export const getAttachmentExtAndDest = (mimetype: string) => {
  let ext = "";
  let dest = null;
  let attachmentType: AttachmentType | null = null;
  if (mimetype in AUDIO_MIMES) {
    ext = AUDIO_MIMES[mimetype as AUDIO_MIME_TYPE];
    dest = "audios";
    attachmentType = "AUDIO";
  } else if (mimetype in VIDEO_MIMES) {
    ext = VIDEO_MIMES[mimetype as VIDEO_MIME_TYPE];
    dest = "videos";
    attachmentType = "VIDEO";
  } else if (mimetype in DOCUMENT_MIMES) {
    ext = DOCUMENT_MIMES[mimetype as DOCUMENT_MIME_TYPE];
    dest = "documents";
    attachmentType = "DOCUMENT";
  }

  return {
    ext,
    dest: dest ? path.join(process.cwd(), dest) : null,
    baseDest: dest,
    attachmentType,
  } as const;
};

export const removeAllSpacesFromText = (value: string) =>
  value.replace(/\s+/g, "");
