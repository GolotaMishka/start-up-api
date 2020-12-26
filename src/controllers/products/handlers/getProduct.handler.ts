import Product from 'entities/product.entity';

const getProduct = async (productId: string) => {
  return await Product.getRepository().findOneOrFail(productId, { relations: ['client'] });
};

export default getProduct;
