import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import MetricRepresentation from 'contracts/representations/metric.representation';
import Metric from 'entities/metric.entity';

const getMetricsList = async (query: PaginatedSearchQueryValidator): Promise<[MetricRepresentation[], number]> => {
  const [items, count] = await Metric.createQueryBuilder('metric')
    .where(query.searchText ? 'metric.value ILIKE :searchText' : 'true')
    .orderBy('metric.value')
    .take(query.limit)
    .skip(query.offset)
    .setParameters({ searchText: `%${query.searchText}%` })
    .getManyAndCount();

  return [items, count];
};

export default getMetricsList;
