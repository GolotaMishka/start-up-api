import { NextFunction, Request, Response } from 'express';

const loggerMiddleware = (request: Request, response: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  console.log(`${request.method} ${request.path}`, request.body);
  next();
};

export default loggerMiddleware;
