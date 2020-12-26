import Product from 'entities/product.entity';
import ProductValidator from 'contracts/validators/product.validator';

const createProduct = (input: ProductValidator) => {
  const product = Product.create(input);
  return product.save();
};

export default createProduct;
