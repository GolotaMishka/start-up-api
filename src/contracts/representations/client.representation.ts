import { Exclude, Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

@Exclude()
export default class UserRepresentation {
  @Expose()
  @IsUUID()
  public id: string;

  @Expose()
  @IsString()
  public name: string;
}
