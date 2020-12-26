import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

import defaultValue from '../../../utils/decorators/defaultValue';
import PaginationQueryValidator from './pagination.query.validator';

@Exclude()
class PaginatedSearchQueryValidator extends PaginationQueryValidator {
  @Expose()
  @IsString()
  @IsOptional()
  public searchText?: string;
}

export default PaginatedSearchQueryValidator;
