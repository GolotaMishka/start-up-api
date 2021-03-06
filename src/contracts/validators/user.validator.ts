import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

@Exclude()
export default class UserValidator {
  @Expose()
  @IsString()
  public firstName: string;

  @Expose()
  @IsString()
  public lastName: string;

  @Expose()
  @IsEmail()
  public email: string;

  @Expose()
  @IsString()
  public password: string;

  @Expose()
  @IsString()
  @IsOptional()
  public phoneNumber?: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  public isAdmin?: boolean;
}
