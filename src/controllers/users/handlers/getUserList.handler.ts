import UserRepresentation from 'contracts/representations/user.representation';
import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import User from 'entities/user.entity';

const getUserList = async (query: PaginatedSearchQueryValidator): Promise<[UserRepresentation[], number]> => {
  const [items, count] = await User.createQueryBuilder('user')
    .where(query.searchText ? "user.firstName || ' ' || user.lastName || ' ' || user.firstName ILIKE :searchText" : 'true')
    .orderBy('user.lastName')
    .addOrderBy('user.firstName')
    .take(query.limit)
    .skip(query.offset)
    .setParameters({ searchText: `%${query.searchText}%` })
    .getManyAndCount();

  return [items, count];
};

export default getUserList;
