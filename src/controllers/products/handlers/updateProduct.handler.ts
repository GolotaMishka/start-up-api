import ProductValidator from 'contracts/validators/product.validator';
import Product from 'entities/product.entity';

const updateProduct = async (productId: string, productData: Partial<ProductValidator>) => {
  const product = await Product.getRepository().findOneOrFail(productId);
  product.merge(productData);

  return product.save();
};

export default updateProduct;
