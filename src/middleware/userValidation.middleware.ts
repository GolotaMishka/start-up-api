import { NextFunction, Request, Response } from 'express';
import User from '../entities/user.entity';
import InvalidAccessToken from '../utils/errors/invalidAccessToken';

const userValidationMiddleware = async (request: Request, response: Response, next: NextFunction) => {
  try {
    request.user = await User.findOneOrFail(request.token.userId, { relations: ['avatar'] });
  } catch (error) {
    throw new InvalidAccessToken();
  }

  next();
};

export default userValidationMiddleware;
