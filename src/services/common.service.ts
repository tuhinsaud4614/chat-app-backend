import { existsSync, mkdirSync } from "fs";
import { nanoid } from "nanoid";
import path from "path";
import { HttpError } from "../models";
import {
  IExtendedImage,
  IMAGE_BREAKPOINTS,
  IMAGE_MIMES,
  IMAGE_MIME_TYPE,
  removeDir,
  resizeImage,
} from "../utility";

export const generateImages = async (
  file: Express.Multer.File,
  subDir?: string
) => {
  const imageName = subDir || nanoid();
  const location = path.join(process.cwd(), "images", imageName);

  if (!existsSync(location)) {
    mkdirSync(location, { recursive: true });
  }

  try {
    const format = IMAGE_MIMES[file.mimetype as IMAGE_MIME_TYPE];
    const result = await IMAGE_BREAKPOINTS.reduce<Promise<IExtendedImage>>(
      async (memo, breakpoint) => {
        const temp = await resizeImage(
          imageName,
          file.buffer,
          location,
          format,
          {
            width: typeof breakpoint === "number" ? breakpoint : undefined,
            baseName: breakpoint.toString(),
          }
        );

        return {
          ...(await memo),
          [breakpoint]: { ...temp },
        };
      },
      {} as Promise<IExtendedImage>
    );
    return { ...result, parentDir: imageName } as IExtendedImage;
  } catch (error) {
    removeDir(location);
    throw new HttpError("Avatar upload failed", 500);
  }
};
