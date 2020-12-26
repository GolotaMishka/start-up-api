import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import nested from 'utils/decorators/nested';
import ClientRepresentation from './client.representation';

@Exclude()
export default class ProductRepresentation {
  @Expose()
  @IsUUID()
  public id: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsBoolean()
  public active: boolean;

  @Expose()
  @IsBoolean()
  public userReporting: boolean;

  @Expose()
  @IsOptional()
  @nested(ClientRepresentation)
  public client?: ClientRepresentation;
}
