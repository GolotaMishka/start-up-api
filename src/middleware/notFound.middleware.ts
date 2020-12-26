import { NextFunction, Request, Response } from 'express';

import NotFound from '../utils/responses/errors/notFound';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notFoundMiddleware = (request: Request, response: Response, next: NextFunction) => {
  console.log(`endpoint: ${request.method} (${request.path}) was called but not registered`);
  throw new NotFound('Requested endpoint was not found');
};

export default notFoundMiddleware;
