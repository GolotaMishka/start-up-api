import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import MetricValidator from 'contracts/validators/metric.validator';
import Metric from 'entities/metric.entity';
import ControllerBase from 'utils/controllers/controllerBase';
import description from 'utils/decorators/description';
import deleteById from 'utils/handlers/deleteById.handler';
import { IDictionary } from 'utils/interfaces/IDictionary.interface';
import DataResponse from 'utils/responses/data.response';
import ListResponse from 'utils/responses/list.response';

import getMetricsList from './handlers/getMetricsList.handler';
import getMetric from './handlers/getMetric.handler';
import updateMetric from './handlers/updateMetric.handler';
import createMetric from './handlers/createMetric.handler';

export default class MetricController extends ControllerBase {
  @description('Gets metrics')
  public async getList(query: PaginatedSearchQueryValidator) {
    const [items, count] = await getMetricsList(query);
    return ListResponse.ok(count, items);
  }

  @description('Gets metric by id')
  public async getById(body: null, { metricId }: IDictionary<string>) {
    const metric = await getMetric(metricId);
    return DataResponse.ok(metric);
  }

  @description('Update metric by id')
  public async update(body: MetricValidator, { metricId }: IDictionary<string>) {
    const metric = await updateMetric(metricId, body);
    return DataResponse.ok(metric);
  }

  @description('Create metric')
  public async create(body: MetricValidator) {
    const entity = await createMetric(body);
    return DataResponse.created(entity);
  }

  @description('Remove metric by id')
  public async delete(body: null, { metricId }: IDictionary<string>) {
    await deleteById(Metric, metricId);
  }
}
