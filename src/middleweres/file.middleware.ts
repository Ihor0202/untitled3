import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { ApiErrors } from "../errors/api.errors";
// import { UploadedFile } from "express-fileupload";
//
// import { ApiErrors } from "../errors/api.errors";

// class FileMiddleware {
//   public isFileValid() {
//     config: { avatarSize: number; avatarTypes: string[] }, // key: string,
//     return (req: Request, res: Response, next: NextFunction) => {
//       try {
//         const file = req.files?.[key] as UploadedFile;
//         if (!file) {
//           throw new ApiErrors("File not found", 400);
//         }
//         if (file.size > config.avatarSize) {
//           throw new ApiErrors("File is too big", 400);
//         }
//         if (!config.avatarTypes.includes(file.mimetype)) {
//           throw new ApiErrors("Invalid file type", 400);
//         }
//         next();
//       } catch (e) {
//         next(e);
//       }
//     };
//   }
// }
class FileMiddleware {
  public isFileValid(
    key: string,
    config: { avatarSize: number; avatarTypes: string[] },
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const file = req.files?.[key] as UploadedFile;
        if (!file) {
          throw new ApiErrors("File not found", 400);
        }
        if (file.size > config.avatarSize) {
          throw new ApiErrors("File is too big", 400);
        }
        if (!config.avatarTypes.includes(file.mimetype)) {
          throw new ApiErrors("Invalid file type", 400);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const fileMiddleware = new FileMiddleware();
