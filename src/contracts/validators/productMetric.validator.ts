import { Exclude, Expose } from 'class-transformer';
import { IsString, IsBoolean, IsDateString, IsUUID, IsOptional } from 'class-validator';

@Exclude()
export default class ProductMetricValidator {
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
  @IsOptional()
  @IsUUID()
  public productId?: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  public metricId?: string;
}
