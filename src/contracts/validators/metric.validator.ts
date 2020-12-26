import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export default class MetricValidator {
  @Expose()
  @IsString()
  public value: string;

  @Expose()
  @IsString()
  public type: string;
}
