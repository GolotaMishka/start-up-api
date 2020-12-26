import ProductRepresentation from 'contracts/representations/product.representation';
import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import Product from 'entities/product.entity';

const getProductList = async (query: PaginatedSearchQueryValidator): Promise<[ProductRepresentation[], number]> => {
  const [items, count] = await Product.createQueryBuilder('product')
    .where(query.searchText ? 'product.name ILIKE :searchText' : 'true')
    .orderBy('product.name')
    .take(query.limit)
    .skip(query.offset)
    .setParameters({ searchText: `%${query.searchText}%` })
    .getManyAndCount();
  return [items, count];
};

export default getProductList;
