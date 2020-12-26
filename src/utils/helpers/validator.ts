import { validate, ValidationError } from 'class-validator';

import ResponseValidationError from '../responses/errors/validationError';

const validator = async (object: object, skipMissingProperties = false) => {
  const validationErrors: ValidationError[] = await validate(object, { skipMissingProperties });

  if (validationErrors.length > 0) {
    const errors = validationErrors.reduce(map, {});

    throw new ResponseValidationError(errors);
  }
};

const reduce = (errors: ValidationError[]) => {
  return errors.reduce(map, {});
};

const map = (m: any, error: ValidationError) => {
  m[error.property] = error.constraints ? Object.values(error.constraints) : reduce(error.children);
  return m;
};

export default validator;
