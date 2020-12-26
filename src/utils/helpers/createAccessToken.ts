import User from 'entities/user.entity';
import * as jwt from 'jsonwebtoken';
import IAccessTokenData from 'utils/interfaces/accessTokenData.interface';

import IAccessToken from '../interfaces/accessToken.interface';

const createAccessToken = async (user: User): Promise<IAccessToken> => {
  const expiresIn = Number(process.env.TOKEN_ACCESS_LIFETIME);
  const secret = process.env.JWT_SECRET;

  let foundUser;
  if (!(user instanceof User)) {
    foundUser = await User.getRepository().findSingle(user);
  } else {
    foundUser = user as User;
  }

  const dataStoredInToken: IAccessTokenData = {
    userId: foundUser.id,
    isAdmin: foundUser.isAdmin,
  };

  return {
    expiresIn,
    token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    data: dataStoredInToken as IAccessTokenData,
  };
};

export default createAccessToken;
