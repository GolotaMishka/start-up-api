import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export default class UserValidator {
  @Expose()
  @IsString()
  public name: string;
}
