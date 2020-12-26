import User from '../../../entities/user.entity';
import IAccessTokenData from '../../interfaces/accessTokenData.interface';
import ResponseBase from '../../responses/responseBase';

declare module 'express' {
  interface Request {
    token: IAccessTokenData;
    user: User;
  }
  interface Response {
    body: ResponseBase;
  }
}
