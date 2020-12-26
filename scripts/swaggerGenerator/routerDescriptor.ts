import { ClassType } from 'class-transformer/ClassTransformer';
import { getFromContainer, MetadataStorage } from 'class-validator';
import * as express from 'express';
import { PathParams } from 'express-serve-static-core';
import { isFunction } from 'util';

import authenticator from '../../src/middleware/authenticator.middleware';
import bodyValidator from '../../src/middleware/bodyValidation.middleware';
import fileValidator from '../../src/middleware/fileValidation.middleware';
import queryValidator from '../../src/middleware/queryValidation.middleware';
import representMiddleware from '../../src/middleware/represent.middleware';
import IRequirement from '../../src/utils/authorization/requirement.interface';
import { Delegator } from '../../src/utils/controllers/delegator';
import IRouter from '../../src/utils/interfaces/router.interface';
import MethodType from './method.type';
import { EndpointDescription, RouterDescription } from './routerDescription';

class RouterDescriptor {
  private routerDescription: RouterDescription;
  private container: MetadataStorage;

  constructor() {
    this.overrideRouter();
    this.overrideBodyValidator();
    this.overrideQueryValidator();
    this.overrideFileValidator();
    this.overridePresenter();
    this.overrideAuthenticator();
    this.overrideDelegatorGetFunctions()

    this.container = getFromContainer(MetadataStorage);
  }

  public generateFor<T extends IRouter>(routerType: ClassType<T>) {
    this.routerDescription = new RouterDescription();
    const router = new routerType();
    this.routerDescription.basePath = router.path;

    return this.routerDescription;
  }

  private getMetadata(type: any) {
    if (!type || Array.isArray(type)) {
      return;
    }

    const metadata = this.container.getTargetValidationMetadatas(type, undefined);
    const groupedMetadata = this.container.groupByPropertyName(metadata);

    return groupedMetadata;
  }

  private handleRoute = (method: MethodType) => {
    return (path: PathParams, ...handlers: any[]) => {
      const endpointDescription = new EndpointDescription(path.toString(), method);

      handlers.forEach((handler: any) => {
        try {
          if (!isAsync(handler)) {
            let result;

            // this is for handlers we haven't added to the routerdescriptor
            try {
              result = handler();
            } catch (error) {
              return;
            }
            const [handlerType, responseDataType] = result;
            let type = responseDataType;

            if (!isFunction(responseDataType) && handlerType !== HandlerTypes.authenticator && responseDataType) {
              type = responseDataType.constructor;
            } else if (!responseDataType) {
              return;
            }
            const metadata = this.getMetadata(type);

            if (type.name === 'ListRepresentationFactory' && metadata && metadata.items && metadata.items[0] && metadata.items[0].context) {
              const childType = metadata.items[0].context;
              const name = childType.name.replace('Representation', 'ListRepresentation');
              type = { name, childType };
            }

            switch (handlerType) {
              case HandlerTypes.bodyValidator:
                endpointDescription.bodyValidatorMetadata = metadata;
                endpointDescription.bodyValidatorTypeName = type.name;
                break;

              case HandlerTypes.queryValidator:
                endpointDescription.queryValidatorMetadata = metadata;
                endpointDescription.queryValidatorTypeName = type.name;
                break;

              case HandlerTypes.representer:
                endpointDescription.representationMetadata = metadata;
                endpointDescription.representationTypeName = type.name;
                endpointDescription.childType = type.childType;
                break;

              case HandlerTypes.authenticator:
                endpointDescription.isAuthorizationRequired = true;
                endpointDescription.authorizationRequirements = type;
                break;
              case HandlerTypes.fileValidator:
                endpointDescription.hasFile = true;
                break;
            }
          } else {
            endpointDescription.operationId = handler.name;
            endpointDescription.description = (Reflect as any).getMetadata('Panenco', handler, handler.name);
          }
        } catch (error) {
          console.log(error);
        }
      });

      this.routerDescription.endpoints.push(endpointDescription);
    };
  };

  private overrideBodyValidator() {
    (bodyValidator as any) = function mockedValidator(type: any, skipMissingProperties = false) {
      return () => {
        return [HandlerTypes.bodyValidator, type, skipMissingProperties];
      };
    };
  }

  private overrideQueryValidator() {
    (queryValidator as any) = function mockedValidator(type: any, skipMissingProperties = true) {
      return () => {
        return [HandlerTypes.queryValidator, type, skipMissingProperties];
      };
    };
  }

  private overrideFileValidator() {
    (fileValidator as any) = function mockedFileValidator() {
      return [HandlerTypes.fileValidator, 'file'];
    };
  }

  private overridePresenter() {
    (representMiddleware as any) = function mockedPresenter(type: any) {
      return () => {
        return [HandlerTypes.representer, type];
      };
    };
  }

  private overrideAuthenticator() {
    (authenticator as any) = function mockedAuthenticator(...requirements: IRequirement[]) {
      return () => {
        return [HandlerTypes.authenticator, requirements];
      };
    };
  }

  private overrideDelegatorGetFunctions() {
    Delegator.prototype.getFunctions = function () {
      return new this.controllerType();
    }
  }

  private overrideRouter() {
    (express.Router as any) = () => {
      return {
        get: this.handleRoute(MethodType.get),
        post: this.handleRoute(MethodType.post),
        patch: this.handleRoute(MethodType.patch),
        put: this.handleRoute(MethodType.put),
        delete: this.handleRoute(MethodType.delete),
      };
    };
  }
}

enum HandlerTypes {
  bodyValidator,
  representer,
  authenticator,
  queryValidator,
  fileValidator
}

function isAsync(fn: () => {}) {
  return fn.constructor.name === 'AsyncFunction';
}

export default RouterDescriptor;
