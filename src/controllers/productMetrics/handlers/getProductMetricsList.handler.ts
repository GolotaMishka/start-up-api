import ProductMetricRepresentation from 'contracts/representations/productMetric.representation';
import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import ProductMetric from 'entities/productMetric.entity';

const getProductMetricsList = async (query: PaginatedSearchQueryValidator): Promise<[ProductMetricRepresentation[], number]> => {
  const [items, count] = await ProductMetric.createQueryBuilder('productMetric')
    .where(query.searchText ? 'productMetric.value ILIKE :searchText' : 'true')
    .orderBy('productMetric.value')
    .take(query.limit)
    .skip(query.offset)
    .setParameters({ searchText: `%${query.searchText}%` })
    .getManyAndCount();

  return [items, count];
};

export default getProductMetricsList;
