import { createListRepresentation } from 'contracts/representations/list.representation';
import MetricRepresentation from 'contracts/representations/metric.representation';
import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import MetricValidator from 'contracts/validators/metric.validator';
import MetricController from 'controllers/metrics/metric.controller';
import { Router } from 'express';
import authenticator from 'middleware/authenticator.middleware';
import bodyValidator from 'middleware/bodyValidation.middleware';
import queryValidator from 'middleware/queryValidation.middleware';
import representer from 'middleware/represent.middleware';
import adminRequirement from 'utils/authorization/admin.requirement';
import { Delegator } from 'utils/controllers/delegator';
import IRouter from 'utils/interfaces/router.interface';

class MetricRouter implements IRouter {
  public router: Router = Router();
  public path = 'metrics';

  constructor() {
    const { getList, getById, update, delete: deleteFunction, create } = new Delegator(MetricController).getFunctions();

    this.router.get('', authenticator(), queryValidator(PaginatedSearchQueryValidator), getList, representer(createListRepresentation(MetricRepresentation)));

    this.router.get('/:metricId', authenticator(), getById, representer(MetricRepresentation));

    this.router.patch('/:metricId', authenticator(adminRequirement), bodyValidator(MetricValidator, true), update, representer(MetricRepresentation));

    this.router.post('', authenticator(adminRequirement), bodyValidator(MetricValidator), create, representer(MetricRepresentation));

    this.router.delete('/:metricId', authenticator(adminRequirement), deleteFunction, representer());
  }
}

export default MetricRouter;
