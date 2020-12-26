import { ClassType } from 'class-transformer/ClassTransformer';
import { BaseEntity, FindConditions, getRepository } from 'typeorm';

const deleteById = async <T extends BaseEntity>(entity: ClassType<T>, id: string): Promise<T> => {
  const object = await getRepository(entity).findOneOrFail(id);
  return object.remove();
};

export const deleteByCondition = async <T extends BaseEntity>(entity: ClassType<T>, conditions?: FindConditions<T>): Promise<T> => {
  const object = await getRepository(entity).findOneOrFail(conditions);
  return object.remove();
};

export default deleteById;
