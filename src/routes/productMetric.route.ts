import { createListRepresentation } from 'contracts/representations/list.representation';
import ProductMetricRepresentation from 'contracts/representations/productMetric.representation';
import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import ProductMetricValidator from 'contracts/validators/productMetric.validator';
import ProductMetricController from 'controllers/productMetrics/productMetric.controller';
import { Router } from 'express';
import authenticator from 'middleware/authenticator.middleware';
import bodyValidator from 'middleware/bodyValidation.middleware';
import queryValidator from 'middleware/queryValidation.middleware';
import representer from 'middleware/represent.middleware';
import adminRequirement from 'utils/authorization/admin.requirement';
import { Delegator } from 'utils/controllers/delegator';
import IRouter from 'utils/interfaces/router.interface';

class ProductMetricRouter implements IRouter {
  public router: Router = Router();
  public path = 'product-metrics';

  constructor() {
    const { getList, getById, update, delete: deleteFunction, create } = new Delegator(ProductMetricController).getFunctions();

    this.router.get('', authenticator(), queryValidator(PaginatedSearchQueryValidator), getList, representer(createListRepresentation(ProductMetricRepresentation)));

    this.router.get('/:productMetricId', authenticator(), getById, representer(ProductMetricRepresentation));

    this.router.patch('/:productMetricId', authenticator(adminRequirement), bodyValidator(ProductMetricValidator, true), update, representer(ProductMetricRepresentation));

    this.router.post('', authenticator(adminRequirement), bodyValidator(ProductMetricValidator), create, representer(ProductMetricRepresentation));

    this.router.delete('/:productMetricId', authenticator(adminRequirement), deleteFunction, representer());
  }
}

export default ProductMetricRouter;
