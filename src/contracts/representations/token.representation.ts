import { IsString, IsDateString, IsOptional } from 'class-validator';

import { Exclude, Expose } from 'class-transformer';

@Exclude()
class TokenRepresentation {
  @Expose()
  @IsString()
  public id: string;

  @Expose()
  @IsString()
  public value: string;

  @Expose()
  @IsString()
  @IsOptional()
  public userId: string;

  @Expose()
  @IsDateString()
  public createdAt: Date;

  @Expose()
  @IsDateString()
  public updatedAt: Date;

  @Expose()
  @IsDateString()
  public expiredAt: Date;
}

export default TokenRepresentation;
