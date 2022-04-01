import { mkdirSync } from "fs";
import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import { HttpError } from "../models";
import {
  AUDIO_MIMES,
  DOCUMENT_MIMES,
  getAttachmentExtAndDest,
  IMAGE_MIMES,
  IMAGE_MIME_TYPE,
  maxFileSize,
  VIDEO_MIMES,
} from "../utility";

const diskStore = (dest: string) => {
  return diskStorage({
    destination(_, __, cb) {
      mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename(_, file, cb) {
      if (!(file.mimetype in IMAGE_MIMES)) {
        return cb(new HttpError("Invalid image type", 422), "");
      }
      const ext = IMAGE_MIMES[file.mimetype as IMAGE_MIME_TYPE];
      const gId = nanoid();
      const imageName = `${gId}.${ext}`;
      cb(null, imageName);
    },
  });
};

export const imageUpload = (
  maxSize: number = maxFileSize(1),
  dest?: string
) => {
  return multer({
    limits: { fileSize: maxSize },
    storage: dest ? diskStore(dest) : undefined,
    fileFilter(_, file, cb) {
      if (!(file.mimetype in IMAGE_MIMES)) {
        return cb(new HttpError("Invalid image type", 422));
      }
      cb(null, true);
    },
  });
};

const attachmentDiskStore = diskStorage({
  destination(_, file, cb) {
    const { dest } = getAttachmentExtAndDest(file.mimetype);

    if (!dest) {
      return cb(new HttpError("Invalid attachment type", 422), "");
    }
    mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename(_, file, cb) {
    const { ext } = getAttachmentExtAndDest(file.mimetype);

    if (!ext) {
      return cb(new HttpError("Invalid attachment type", 422), "");
    }

    const gId = nanoid();
    const attachmentName = `${gId}.${ext}`;
    cb(null, attachmentName);
  },
});

export const attachmentUpload = (maxSize: number = maxFileSize(1)) => {
  return multer({
    limits: { fileSize: maxSize },
    storage: attachmentDiskStore,
    fileFilter(_, file, cb) {
      if (
        file.mimetype in AUDIO_MIMES ||
        file.mimetype in VIDEO_MIMES ||
        file.mimetype in DOCUMENT_MIMES
      ) {
        return cb(null, true);
      }
      return cb(new HttpError("Invalid attachment type", 422));
    },
  });
};
