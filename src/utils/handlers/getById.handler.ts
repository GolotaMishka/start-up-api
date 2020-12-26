import { ClassType } from 'class-transformer/ClassTransformer';
import { BaseEntity, FindOneOptions, getRepository } from 'typeorm';

const getById = <T extends BaseEntity>(entity: ClassType<T>, id: string, options: FindOneOptions = {}): Promise<T> => {
  return getRepository(entity).findSingle(id, options);
};

export default getById;
