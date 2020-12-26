import ProductMetric from 'entities/productMetric.entity';
import Product from 'entities/product.entity';
import Metric from 'entities/metric.entity';

import ProductMetricValidator from 'contracts/validators/productMetric.validator';

const createProductMetric = async (input: ProductMetricValidator) => {
  const product = await Product.getRepository().findOneOrFail(input.productId);
  const metric = await Metric.getRepository().findOneOrFail(input.metricId);

  const productMetric = ProductMetric.create({
    value: input.value,
    restricted: input.restricted,
    timeStamp: input.timeStamp,
    metric: metric,
    product: product,
  });

  return productMetric.save();
};

export default createProductMetric;
