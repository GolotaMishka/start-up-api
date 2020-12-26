import { Exclude, Expose } from 'class-transformer';
import defaultValue from 'utils/decorators/defaultValue';
import numeric from 'utils/decorators/numeric';

@Exclude()
class PaginationQueryValidator {
  @Expose()
  @defaultValue(0)
  @numeric()
  public offset: number;

  @Expose()
  @defaultValue(20)
  @numeric()
  public limit: number;
}

export default PaginationQueryValidator;
