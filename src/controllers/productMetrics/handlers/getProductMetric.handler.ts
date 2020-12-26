import ProductMetric from 'entities/productMetric.entity';

const getProductMetric = async (productMetricId: string) => {
  return await ProductMetric.getRepository().findOneOrFail(productMetricId, { relations: ['metric'] });
};

export default getProductMetric;
