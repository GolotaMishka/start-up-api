import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import ErrorRepresentation from 'contracts/representations/error.representation';

@Exclude()
export default class DataErrorRepresentation extends ErrorRepresentation {
  @Expose()
  @IsNotEmpty()
  public data: any;
}
