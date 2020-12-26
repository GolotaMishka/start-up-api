import { Exclude, Expose } from 'class-transformer';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import ClientValidator from 'contracts/validators/client.validator';
import nested from 'utils/decorators/nested';

@Exclude()
export default class ProductValidator {
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
  @nested(ClientValidator)
  public client?: ClientValidator;
}
