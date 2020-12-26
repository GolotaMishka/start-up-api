import ClientRepresentation from 'contracts/representations/client.representation';
import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import Client from 'entities/client.entity';

const getClientList = async (query: PaginatedSearchQueryValidator): Promise<[ClientRepresentation[], number]> => {
  const [items, count] = await Client.createQueryBuilder('client')
    .where(query.searchText ? 'user.client ILIKE :searchText' : 'true')
    .orderBy('client.name')
    .take(query.limit)
    .skip(query.offset)
    .setParameters({ searchText: `%${query.searchText}%` })
    .getManyAndCount();

  return [items, count];
};

export default getClientList;
