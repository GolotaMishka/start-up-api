import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

import ErrorBase from '../../utils/responses/errors/errorBase';

@Exclude()
class ErrorRepresentation {
  @Expose()
  @IsString()
  public message: string;

  @Expose()
  @IsString()
  public reason: string;

  constructor(error?: ErrorBase) {
    if (!error) {
      return;
    }
    this.message = error.message;
    this.reason = error.reason;
  }
}

export default ErrorRepresentation;
