import User from 'entities/user.entity';
import IAuthenticationPayload from 'utils/interfaces/authentication.interface';

import createAccessToken from './createAccessToken';

export const createLoginTokens = async (user: User): Promise<IAuthenticationPayload> => {
  const tokenData = await createAccessToken(user);
  await user.save();

  return { tokenData, user };
};
