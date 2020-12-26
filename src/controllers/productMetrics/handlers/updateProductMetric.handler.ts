import ProductMetricValidator from 'contracts/validators/productMetric.validator';
import ProductMetric from 'entities/productMetric.entity';

const updateProductMetric = async (productMetricId: string, productMetricData: Partial<ProductMetricValidator>) => {
  const productMetric = await ProductMetric.getRepository().findOneOrFail(productMetricId);
  productMetric.merge(productMetricData);

  return productMetric.save();
};

export default updateProductMetric;
