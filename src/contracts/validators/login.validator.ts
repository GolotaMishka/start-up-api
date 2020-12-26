import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export default class LoginValidator {
  @Expose()
  @IsString()
  public email: string;

  @Expose()
  @IsString()
  public password: string;
}
