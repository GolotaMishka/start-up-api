import { plainToClass } from 'class-transformer';
import * as express from 'express';
import validator from '../utils/helpers/validator';

const queryValidator = (type: any, skipMissingProperties = true): express.RequestHandler => {
  return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const input = plainToClass(type, request.query);
    // eslint-disable-next-line
    // await validator(input, skipMissingProperties);

    // request.query = input;
    next();
  };
};

export default queryValidator;
