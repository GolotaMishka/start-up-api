import Metric from 'entities/metric.entity';

const getMetric = async (metricId: string) => {
  return await Metric.getRepository().findOneOrFail(metricId);
};

export default getMetric;
