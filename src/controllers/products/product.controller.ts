import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import ProductValidator from 'contracts/validators/product.validator';
import Product from 'entities/product.entity';
import ControllerBase from 'utils/controllers/controllerBase';
import description from 'utils/decorators/description';
import deleteById from 'utils/handlers/deleteById.handler';
import { IDictionary } from 'utils/interfaces/IDictionary.interface';
import DataResponse from 'utils/responses/data.response';
import ListResponse from 'utils/responses/list.response';

import getProductList from './handlers/getProductList.handler';
import getProduct from './handlers/getProduct.handler';
import updateProduct from './handlers/updateProduct.handler';
import createProduct from './handlers/createProduct.handler';

export default class ProductController extends ControllerBase {
  @description('Gets products')
  public async getList(query: PaginatedSearchQueryValidator) {
    const [items, count] = await getProductList(query);
    return ListResponse.ok(count, items);
  }

  @description('Gets product by id')
  public async getById(body: null, { productId }: IDictionary<string>) {
    const product = await getProduct(productId);
    return DataResponse.ok(product);
  }

  @description('Update product by id')
  public async update(body: ProductValidator, { productId }: IDictionary<string>) {
    const product = await updateProduct(productId, body);
    return DataResponse.ok(product);
  }

  @description('Create product')
  public async create(body: ProductValidator) {
    const entity = await createProduct(body);
    return DataResponse.created(entity);
  }

  @description('Remove product by id')
  public async delete(body: null, { productId }: IDictionary<string>) {
    await deleteById(Product, productId);
  }
}
