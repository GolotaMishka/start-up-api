import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import ProductMetricValidator from 'contracts/validators/productMetric.validator';
import ProductMetric from 'entities/productMetric.entity';
import ControllerBase from 'utils/controllers/controllerBase';
import description from 'utils/decorators/description';
import deleteById from 'utils/handlers/deleteById.handler';
import { IDictionary } from 'utils/interfaces/IDictionary.interface';
import DataResponse from 'utils/responses/data.response';
import ListResponse from 'utils/responses/list.response';

import getProductMetricsList from './handlers/getProductMetricsList.handler';
import getProductMetric from './handlers/getProductMetric.handler';
import updateProductMetric from './handlers/updateProductMetric.handler';
import createProductMetric from './handlers/createProductMetric.handler';

export default class ProductMetricController extends ControllerBase {
  @description('Gets product metrics')
  public async getList(query: PaginatedSearchQueryValidator) {
    const [items, count] = await getProductMetricsList(query);
    return ListResponse.ok(count, items);
  }

  @description('Gets product metric by id')
  public async getById(body: null, { productMetricId }: IDictionary<string>) {
    const productMetric = await getProductMetric(productMetricId);
    return DataResponse.ok(productMetric);
  }

  @description('Update product metric by id')
  public async update(body: ProductMetricValidator, { productMetricId }: IDictionary<string>) {
    const productMetric = await updateProductMetric(productMetricId, body);
    return DataResponse.ok(productMetric);
  }

  @description('Create product metric')
  public async create(body: ProductMetricValidator) {
    const entity = await createProductMetric(body);
    return DataResponse.created(entity);
  }

  @description('Remove product metric by id')
  public async delete(body: null, { productMetricId }: IDictionary<string>) {
    await deleteById(ProductMetric, productMetricId);
  }
}
