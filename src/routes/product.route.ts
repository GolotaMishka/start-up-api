import { createListRepresentation } from 'contracts/representations/list.representation';
import ProductRepresentation from 'contracts/representations/product.representation';
import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import ProductValidator from 'contracts/validators/product.validator';
import ProductController from 'controllers/products/product.controller';
import { Router } from 'express';
import authenticator from 'middleware/authenticator.middleware';
import bodyValidator from 'middleware/bodyValidation.middleware';
import queryValidator from 'middleware/queryValidation.middleware';
import representer from 'middleware/represent.middleware';
import adminRequirement from 'utils/authorization/admin.requirement';
import { Delegator } from 'utils/controllers/delegator';
import IRouter from 'utils/interfaces/router.interface';

class ProductRouter implements IRouter {
  public router: Router = Router();
  public path = 'products';

  constructor() {
    const { getList, getById, update, delete: deleteFunction, create } = new Delegator(ProductController).getFunctions();

    this.router.get('', authenticator(), queryValidator(PaginatedSearchQueryValidator), getList, representer(createListRepresentation(ProductRepresentation)));

    this.router.get('/:productId', authenticator(), getById, representer(ProductRepresentation));

    this.router.patch('/:productId', authenticator(adminRequirement), bodyValidator(ProductValidator, true), update, representer(ProductRepresentation));

    this.router.post('', authenticator(adminRequirement), bodyValidator(ProductValidator), create, representer(ProductRepresentation));

    this.router.delete('/:productId', authenticator(adminRequirement), deleteFunction, representer());
  }
}

export default ProductRouter;
