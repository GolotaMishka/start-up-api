import { createListRepresentation } from 'contracts/representations/list.representation';
import ClientRepresentation from 'contracts/representations/client.representation';
import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import ClientValidator from 'contracts/validators/client.validator';
import ClientController from 'controllers/clients/client.controller';
import { Router } from 'express';
import authenticator from 'middleware/authenticator.middleware';
import bodyValidator from 'middleware/bodyValidation.middleware';
import queryValidator from 'middleware/queryValidation.middleware';
import representer from 'middleware/represent.middleware';
import adminRequirement from 'utils/authorization/admin.requirement';
import { Delegator } from 'utils/controllers/delegator';
import IRouter from 'utils/interfaces/router.interface';

class ClientRouter implements IRouter {
  public router: Router = Router();
  public path = 'clients';

  constructor() {
    const { getList, getById, update, delete: deleteFunction, create } = new Delegator(ClientController).getFunctions();

    // this.router.get('', authenticator(adminRequirement), queryValidator(PaginatedSearchQueryValidator), getList, representer(createListRepresentation(ClientRepresentation)));
    this.router.get('', queryValidator(PaginatedSearchQueryValidator), getList, representer(createListRepresentation(ClientRepresentation)));

    this.router.get('/:clientId', authenticator(adminRequirement), getById, representer(ClientRepresentation));

    this.router.patch('/:clientId', authenticator(adminRequirement), bodyValidator(ClientValidator, true), update, representer(ClientRepresentation));

    this.router.post('', authenticator(adminRequirement), bodyValidator(ClientValidator), create, representer(ClientRepresentation));

    this.router.delete('/:clientId', authenticator(adminRequirement), deleteFunction, representer());
  }
}

export default ClientRouter;
