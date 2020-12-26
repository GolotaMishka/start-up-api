import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsDateString, IsString, IsUUID, IsOptional } from 'class-validator';
import nested from 'utils/decorators/nested';
import ProductRepresentation from './product.representation';
import MetricRepresentation from './metric.representation';

@Exclude()
export default class ProductMetricRepresentation {
  @Expose()
  @IsUUID()
  public id: string;

  @Expose()
  @IsString()
  public value: string;

  @Expose()
  @IsBoolean()
  public restricted: boolean;

  @Expose()
  @IsDateString()
  public timeStamp: Date;

  @Expose()
  @nested(MetricRepresentation)
  public metric: MetricRepresentation;

  @Expose()
  @nested(ProductRepresentation)
  public product: ProductRepresentation;
}
