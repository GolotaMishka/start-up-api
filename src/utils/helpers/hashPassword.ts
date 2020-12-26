import { hash } from 'bcryptjs';

const hashPassword = (password: string): Promise<string> => {
  return hash(password, 10);
};

export default hashPassword;
