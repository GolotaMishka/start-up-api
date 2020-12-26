import { NextFunction, Request, Response } from 'express';
import Forbidden from 'utils/responses/errors/forbidden';

const internalRequirement = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'development') {
    if (Boolean(req.headers['x-appengine-cron']) || req.headers['x-api-key'] === process.env.INTERNAL_API_KEY) {
      return next();
    }
  }
  throw new Forbidden('Not enough rights', 'NoAccessToRoute');
};

export default internalRequirement;
