import ErrorBase from './errors/errorBase';
import ResponseBase from './responseBase';
import StatusCode from './statusCode';

class ErrorResponse extends ResponseBase {
  public static badRequest(payload: Error): ErrorResponse {
    return ErrorResponse.create(StatusCode.badRequest, payload);
  }

  public static unauthorized(payload: ErrorBase): ErrorResponse {
    return ErrorResponse.create(StatusCode.unauthorized, payload);
  }

  public static forbidden(payload: ErrorBase): ErrorResponse {
    return ErrorResponse.create(StatusCode.forbidden, payload);
  }

  public static notFound(payload: ErrorBase): ErrorResponse {
    return ErrorResponse.create(StatusCode.notFound, payload);
  }

  public static conflict(payload: ErrorBase): ErrorResponse {
    return ErrorResponse.create(StatusCode.conflict, payload);
  }

  public static retryWith(payload: ErrorBase): ErrorResponse {
    return ErrorResponse.create(StatusCode.retryWith, payload);
  }

  public static serverError(payload: Error): ErrorResponse {
    return ErrorResponse.create(StatusCode.serverError, payload);
  }

  public static queryFailed(payload: Error): ErrorResponse {
    return ErrorResponse.create(StatusCode.badRequest, payload);
  }

  protected static create(status: StatusCode, payload: Error): ErrorResponse {
    return new ErrorResponse(status, payload);
  }
}

export default ErrorResponse;
