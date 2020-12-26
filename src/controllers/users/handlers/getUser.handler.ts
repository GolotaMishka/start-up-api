import User from 'entities/user.entity';

const getUser = async (userId: string) => {
  return await User.getRepository().findOneOrFail(userId);
};

export default getUser;
