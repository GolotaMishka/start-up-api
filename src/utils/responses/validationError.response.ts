import ErrorResponse from './error.response';
import ValidationError from './errors/validationError';
import StatusCode from './statusCode';

class ValidationErrorResponse extends ErrorResponse {
  public static badRequest(payload: ValidationError<any>): ValidationErrorResponse {
    return ValidationErrorResponse.create(StatusCode.badRequest, payload);
  }
}

export default ValidationErrorResponse;
