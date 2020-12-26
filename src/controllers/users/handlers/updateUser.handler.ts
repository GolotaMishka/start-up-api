import UserValidator from 'contracts/validators/user.validator';
import User from 'entities/user.entity';

const updateUser = async (userId: string, userData: Partial<UserValidator>) => {
  const user = await User.getRepository().findOneOrFail(userId);
  user.merge(userData);

  return user.save();
};

export default updateUser;
