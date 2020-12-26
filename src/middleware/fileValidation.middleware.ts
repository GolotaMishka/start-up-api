import * as express from 'express';
import * as multer from 'multer';

import FileType from '../contracts/enums/file.type';
import ValidationError from '../utils/responses/errors/validationError';

const fileValidator = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (_, metadata, callback) => {
      if (!Object.values(FileType).includes(metadata.mimetype)) {
        callback('Unsupported file format');
      }
      callback(null, true);
    },
  }).single('file');

  request.body = await new Promise((resolve, reject) =>
    upload(request, {}, err => {
      if (err instanceof multer.MulterError) {
        reject(new ValidationError({ file: err.message }));
      } else if (err) {
        reject(new ValidationError({ file: err }));
      }

      return resolve((request as any).file);
    })
  );

  next();
};

export default fileValidator;
