import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import IRequirement from '../utils/authorization/requirement.interface';
import AccessTokenMissing from '../utils/errors/accessTokenMissing';
import InvalidAccessToken from '../utils/errors/invalidAccessToken';
import DataStoredInToken from '../utils/interfaces/accessTokenData.interface';

const authenticator = (...requirements: IRequirement[]) => {
  const handler = async (request: Request, response: Response, next: NextFunction) => {
    const token = request.header('x-auth');

    if (!token) {
      throw new AccessTokenMissing();
    }

    request.token = getTokenData(token);
    await handleRequirements(requirements, request);
    next();
  };

  return handler;
};

const handleRequirements = async (requirements: IRequirement[], request: Request) => {
  await Promise.all(requirements.map(requirement => requirement(request)));
};

const getTokenData = (token: string) => {
  try {
    const secret = process.env.JWT_SECRET;
    return jwt.verify(token, secret) as DataStoredInToken;
  } catch (error) {
    throw new InvalidAccessToken();
  }
};

export default authenticator;
