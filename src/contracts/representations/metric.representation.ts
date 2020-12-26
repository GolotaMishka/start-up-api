import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsString, IsUUID } from 'class-validator';

@Exclude()
export default class MetricRepresentation {
  @Expose()
  @IsUUID()
  public id: string;

  @Expose()
  @IsString()
  public value: string;

  @Expose()
  @IsBoolean()
  public type: string;
}
