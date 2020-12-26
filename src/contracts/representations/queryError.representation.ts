import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
class QueryErrorRepresentation {
  @Expose()
  @IsString()
  public detail: string;

  @Expose()
  @IsString()
  public message: string;
}

export default QueryErrorRepresentation;
