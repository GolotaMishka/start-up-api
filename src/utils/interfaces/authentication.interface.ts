import User from 'entities/user.entity';

import IAccessToken from './accessToken.interface';

interface IAuthenticationPayload {
  tokenData: IAccessToken;
  user?: User;
}

export default IAuthenticationPayload;
