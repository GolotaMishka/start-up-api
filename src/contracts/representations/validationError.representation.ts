import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Exclude()
class ValidationErrorRepresentation {
  @Expose()
  @IsNotEmpty()
  public errors: any;
}

export default ValidationErrorRepresentation;
