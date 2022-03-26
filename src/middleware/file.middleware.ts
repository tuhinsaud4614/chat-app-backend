import { mkdirSync } from "fs";
import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import { HttpError } from "../models";
import { IMAGE_MIMES, IMAGE_MIME_TYPE, maxFileSize } from "../utility";

const diskStore = (dest: string) => {
  const gId = nanoid();
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
      const imageName = `${gId}.${ext}`;
      cb(null, imageName);
    },
  });
};

export const imageUpload = (
  dest?: string,
  maxSize: number = maxFileSize(1)
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
