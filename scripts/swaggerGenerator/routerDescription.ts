import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import IRequirement from '../../src/utils/authorization/requirement.interface';
import MethodType from './method.type';

class RouterDescription {
  public endpoints: EndpointDescription[] = [];
  public basePath: string = null;
}

class EndpointDescription {
  public bodyValidatorMetadata: { [propertyName: string]: ValidationMetadata[] } = null;
  public queryValidatorMetadata: { [propertyName: string]: ValidationMetadata[] } = null;
  public representationMetadata: { [propertyName: string]: ValidationMetadata[] } = null;
  public endpointPath: string = null;
  public methodType: MethodType;
  public operationId: string;
  public description: string;
  public bodyValidatorTypeName: string;
  public queryValidatorTypeName: string;
  public representationTypeName: string;
  public isAuthorizationRequired = false;
  public authorizationRequirements: IRequirement[];
  public childType: any;
  public hasFile = false;

  constructor(endpointPath: string, method: MethodType) {
    this.endpointPath = endpointPath;
    this.methodType = method;
  }
}

export { RouterDescription, EndpointDescription };
