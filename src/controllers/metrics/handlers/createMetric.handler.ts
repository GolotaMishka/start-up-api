import Metric from 'entities/metric.entity';
import MetricValidator from 'contracts/validators/metric.validator';

const createMetric = async (input: MetricValidator) => {
  const metric = Metric.create(input);

  return metric.save();
};

export default createMetric;
