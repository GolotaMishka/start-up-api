import { ClassType } from 'class-transformer/ClassTransformer';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { getConnection } from 'typeorm';
import ExpressContext from 'utils/expressContext';

import ResponseBase from '../responses/responseBase';
import ControllerBase from './controllerBase';
import { IControllerFunctions } from './controllerFunctions.interface';

export class Delegator<TController extends ControllerBase> {
  private readonly controllerType: { new (request: Request, response: Response, next: NextFunction): TController };

  constructor(controllerType: ClassType<TController>) {
    this.controllerType = controllerType;
  }

  public getFunctions(): IControllerFunctions<TController> {
    const keys = Object.getOwnPropertyNames(this.controllerType.prototype);

    const controllerFunctions: IControllerFunctions<TController> = keys.reduce((object, funcName) => {
      object[funcName] = this.run(funcName as any);
      return object;
    }, {} as IControllerFunctions<TController>);

    return controllerFunctions;
  }

  private run(func: keyof TController): RequestHandler {
    return async (request: Request, response: Response, next: NextFunction) => {
      const controller = new this.controllerType(request, response, next);

      this.validateFunction(controller, func);

      const result = await getConnection().transaction(async em => {
        ExpressContext.set('entityManager', em);
        const input = request.body && Object.keys(request.body).length > 0 ? request.body : request.query;
        const handlerResult = await ((controller[func] as unknown) as (...args: any[]) => any)(input, request.params, request.headers);
        return handlerResult;
      });

      this.validateResult(result, func);

      response.body = result;

      next();
    };
  }

  private validateResult(result: any, func: keyof TController) {
    if (result && !(result instanceof ResponseBase)) {
      throw new Error(`${this.controllerType.name}/${func} returned an invalid response object`);
    }
  }

  private validateFunction(controller: TController, func: keyof TController) {
    if (controller[func] && typeof controller[func] !== 'function') {
      throw new Error(`Unknown controller function ${func}`);
    }
  }
}
