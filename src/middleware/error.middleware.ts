import DataErrorRepresentation from 'contracts/representations/dataError.representation';
import ErrorRepresentation from 'contracts/representations/error.representation';
import QueryErrorRepresentation from 'contracts/representations/queryError.representation';
import ValidationErrorRepresentation from 'contracts/representations/validationError.representation';
import { NextFunction, Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import ErrorResponse from 'utils/responses/error.response';
import BadRequest from 'utils/responses/errors/badRequest';
import Conflict from 'utils/responses/errors/conflict';
import Forbidden from 'utils/responses/errors/forbidden';
import NotFound from 'utils/responses/errors/notFound';
import Retry from 'utils/responses/errors/retry';
import Unauthorized from 'utils/responses/errors/unauthorized';
import ValidationError from 'utils/responses/errors/validationError';
import ValidationErrorResponse from 'utils/responses/validationError.response';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware = (error: Error, request: Request, response: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'development') console.error(error, error.message);
  const { responseObject, type } = getResponse(error);
  response.status(responseObject.status);

  response.json({ ...responseObject.getFormattedResponse(type), status: responseObject.status });
};

const getResponse = (error: Error) => {
  if (error instanceof ValidationError) return { responseObject: ValidationErrorResponse.badRequest(error), type: ValidationErrorRepresentation };
  if (error instanceof BadRequest) return { responseObject: ErrorResponse.badRequest(error), type: ErrorRepresentation };
  if (error instanceof Unauthorized) return { responseObject: ErrorResponse.unauthorized(error), type: ErrorRepresentation };
  if (error instanceof Forbidden) return { responseObject: ErrorResponse.forbidden(error), type: ErrorRepresentation };
  if (error instanceof NotFound) return { responseObject: ErrorResponse.notFound(error), type: ErrorRepresentation };
  if (error instanceof Conflict) return { responseObject: ErrorResponse.conflict(error), type: ErrorRepresentation };
  if (error instanceof Retry) return { responseObject: ErrorResponse.retryWith(error), type: DataErrorRepresentation };
  if (error instanceof QueryFailedError) return { responseObject: ErrorResponse.queryFailed(error), type: QueryErrorRepresentation };
  console.log(error);
  return { responseObject: ErrorResponse.serverError(error), type: ErrorRepresentation };
};

export default errorMiddleware;
