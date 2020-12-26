import { compare } from 'bcryptjs';
import LoginValidator from 'contracts/validators/login.validator';
import User from 'entities/user.entity';
import InvalidCredentials from 'utils/errors/invalidCredentials';
import { createLoginTokens } from 'utils/helpers/createLoginTokens';
import IAuthenticationPayload from 'utils/interfaces/authentication.interface';

const getUserOrFail = async (email: string) => {
  try {
    return await User.findOneOrFail({ email });
  } catch (error) {
    throw new InvalidCredentials();
  }
};

const login = async (input: LoginValidator): Promise<IAuthenticationPayload> => {
  const { password, email } = input;

  const user = await getUserOrFail(email.toLowerCase());

  if (!(await compare(password, user.password))) {
    throw new InvalidCredentials();
  }

  return createLoginTokens(user);
};

export default login;
