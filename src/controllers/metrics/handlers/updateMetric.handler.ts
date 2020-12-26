import MetricValidator from 'contracts/validators/metric.validator';
import Metric from 'entities/metric.entity';

const updateMetric = async (metricId: string, metricData: Partial<MetricValidator>) => {
  const metric = await Metric.getRepository().findOneOrFail(metricId);
  metric.merge(metricData);

  return metric.save();
};

export default updateMetric;
