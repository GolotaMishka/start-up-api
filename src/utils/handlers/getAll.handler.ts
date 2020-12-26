import { ClassType } from 'class-transformer/ClassTransformer';
import { BaseEntity, DeepPartial, getRepository } from 'typeorm';

const getAll = <T extends BaseEntity>(
  entity: ClassType<T>,
  offset: number,
  limit: number,
  where?: DeepPartial<T>,
  order?: { [P in keyof T]?: 'ASC' | 'DESC' | 1 | -1 }
): Promise<[T[], number]> => {
  return getRepository(entity).findAndCount({ where: { ...where }, skip: offset, take: limit, order });
};

export default getAll;
