import { createListRepresentation } from 'contracts/representations/list.representation';
import UserRepresentation from 'contracts/representations/user.representation';
import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import UserValidator from 'contracts/validators/user.validator';
import UserController from 'controllers/users/user.controller';
import { Router } from 'express';
import authenticator from 'middleware/authenticator.middleware';
import bodyValidator from 'middleware/bodyValidation.middleware';
import queryValidator from 'middleware/queryValidation.middleware';
import representer from 'middleware/represent.middleware';
import adminRequirement from 'utils/authorization/admin.requirement';
import { Delegator } from 'utils/controllers/delegator';
import IRouter from 'utils/interfaces/router.interface';

class UserRouter implements IRouter {
  public router: Router = Router();
  public path = 'users';

  constructor() {
    const { getList, getById, update, delete: deleteFunction } = new Delegator(UserController).getFunctions();

    this.router.get('', authenticator(), queryValidator(PaginatedSearchQueryValidator), getList, representer(createListRepresentation(UserRepresentation)));

    this.router.get('/:userId', authenticator(), getById, representer(UserRepresentation));

    this.router.patch('/:userId', authenticator(adminRequirement), bodyValidator(UserValidator, true), update, representer(UserRepresentation));

    this.router.delete('/:userId', authenticator(adminRequirement), deleteFunction, representer());
  }
}

export default UserRouter;
