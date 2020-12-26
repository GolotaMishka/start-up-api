/* eslint-disable no-unused-expressions */
import '../../src/utils/config';

import { ClassType } from 'class-transformer/ClassTransformer';
import { getFromContainer, MetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { ValidationMetadata } from 'class-validator/metadata/ValidationMetadata';
import * as path from 'path';

import App from '../../src/app';
import IRequirement from '../../src/utils/authorization/requirement.interface';
import IRouter from '../../src/utils/interfaces/router.interface';
import StatusCode from '../../src/utils/responses/statusCode';
import writeToFile from '../utils/fileWriter';
import MethodType from './method.type';
import { EndpointDescription, RouterDescription } from './routerDescription';
import RouterDescriptor from './routerDescriptor';

// TODO: Because of "secondAttemptAtResolvingArrays" we can simply this whole thing A L0T
class SwaggerGenerator {
  public definitions: any;
  private routerDescriptions: RouterDescription[] = [];
  private routerClassTypes: Array<ClassType<IRouter>>;
  private metadatas: any[];

  constructor(routers: Array<ClassType<IRouter>> = App.routers) {
    this.routerClassTypes = routers;
  }

  public async generate() {
    this.generateRouterDescriptions();

    const swaggerSchema = this.scuffedGenerationOfSchema();

    const json = JSON.stringify(swaggerSchema);

    await writeToFile(path.join('assets', 'swagger.json'), json);
  }

  private scuffedGenerationOfSchema() {
    this.metadatas = (getFromContainer(MetadataStorage) as any).validationMetadatas;
    this.definitions = validationMetadatasToSchemas(this.metadatas);
    const schema = {
      swagger: '2.0',
      info: {
        version: 'v0.1',
        title: `${process.env.APP_NAME} API`
      },
      paths: {},
      definitions: null,
      securityDefinitions: { JWT: { name: 'x-auth', in: 'header', type: 'apiKey', description: 'JWT Authorization header using the JWT scheme. Example: "x-auth: {token}"' } },
      security: [{ JWT: [] }]
    };

    this.routerDescriptions.forEach(routerDescription => {
      routerDescription.endpoints.forEach(endpoint => {
        this.addAdditionalDefinitionIfNeeded(endpoint);
        const path = this.getParsedPath(`/api/${routerDescription.basePath}${endpoint.endpointPath}`);
        const method = endpoint.methodType.toString();
        schema.paths[path] = schema.paths[path] ? schema.paths[path] : {};
        schema.paths[path][method] = {
          tags: [this.getTagFromBasePath(routerDescription.basePath)],
          summary: endpoint.description,
          operationId: endpoint.operationId,
          consumes: ['application/json'],
          produces: ['application/json'],
          parameters: this.getAllParameters(endpoint, routerDescription.basePath),
          responses: this.getResponse(endpoint)
        };
      });
    });

    this.secondAttemptAtResolvingArrays();
    schema.definitions = this.definitions;

    return schema;
  }

  private addAdditionalDefinitionIfNeeded(endpoint: EndpointDescription) {
    if (!endpoint || (!endpoint.representationMetadata && !endpoint.bodyValidatorMetadata)) {
      return;
    }

    endpoint.representationMetadata &&
      Object.keys(endpoint.representationMetadata).forEach(key => {
        const property = endpoint.representationMetadata[key];
        property.forEach(rule => {
          if (rule.type !== 'nestedValidation') {
            return;
          }

          const definition = this.definitions[endpoint.representationTypeName];
          const definitionName = (rule.context as any).name;

          if (rule.each) {
            if (definitionName === 'StringRepresentation') {
              definition.properties.items.items.type = 'string';
              return;
            }

            const element = definition.properties[rule.propertyName];
            element.type = 'array';
            element.$ref = undefined;
            element.items = {};
            element.items.$ref = `#/definitions/${definitionName}`;
          } else {
            definition.properties[rule.propertyName].type = 'object';
            definition.properties[rule.propertyName].$ref = `#/definitions/${definitionName}`;
          }
          this.definitions[endpoint.representationTypeName] = definition;
        });
      });

    endpoint.bodyValidatorMetadata &&
      Object.keys(endpoint.bodyValidatorMetadata).forEach(key => {
        const property = endpoint.bodyValidatorMetadata[key];
        property.forEach(rule => {
          if (rule.type !== 'nestedValidation') {
            return;
          }

          const definition = this.definitions[endpoint.bodyValidatorTypeName];
          const definitionName = (rule.context as any).name;

          if (rule.each) {
            if (definitionName === 'StringRepresentation') {
              definition.properties.items.items.type = 'string';
              return;
            }

            const element = definition.properties[rule.propertyName];
            element.type = 'array';
            element.$ref = undefined;
            element.items = {};
            element.items.$ref = `#/definitions/${definitionName}`;
          } else {
            definition.properties[rule.propertyName].type = 'object';
            definition.properties[rule.propertyName].$ref = `#/definitions/${definitionName}`;
          }
          this.definitions[endpoint.bodyValidatorTypeName] = definition;
        });
      });

    if (endpoint.representationMetadata && !endpoint.representationMetadata.items) {
      this.addArrayOfRepresentationInDefinitions(endpoint.representationTypeName, endpoint.representationMetadata);
    }

    if (endpoint.bodyValidatorMetadata && !endpoint.bodyValidatorMetadata.items) {
      this.addArrayOfRepresentationInDefinitions(endpoint.bodyValidatorTypeName, endpoint.bodyValidatorMetadata);
    }

    if (endpoint.queryValidatorMetadata && !endpoint.queryValidatorMetadata.items) {
      this.addArrayOfRepresentationInDefinitions(endpoint.queryValidatorTypeName, endpoint.queryValidatorMetadata);
    }
  }

  private addArrayOfRepresentationInDefinitions(typeName: string, metadata: { [propertyName: string]: ValidationMetadata[] }) {
    if (!this.definitions[typeName] || !this.definitions[typeName].properties) {
      return;
    }
    const properties = this.definitions[typeName].properties;

    for (const key in properties) {
      if (!properties.hasOwnProperty(key) || properties[key].type !== 'array' || properties[key].items.$ref !== '#/definitions/Array' || !metadata[key][0].context) {
        continue;
      }
      properties[key].items.$ref = `#/definitions/${metadata[key][0].context.name}`;
    }
  }

  private getResponse(endpoint: EndpointDescription) {
    const responses = {};
    if (endpoint.representationTypeName) {
      responses[this.getStatusCode(endpoint.methodType, endpoint.representationTypeName)] = {
        description: endpoint.representationTypeName,
        schema: {
          $ref: `#/definitions/${endpoint.representationTypeName}`
        }
      };
    } else {
      responses[this.getStatusCode(endpoint.methodType, endpoint.representationTypeName)] = {
        description: 'no content'
      };
    }

    return responses;
  }

  private getAllParameters(endpoint: EndpointDescription, basePath: string) {
    const parameters = [];

    if (endpoint.bodyValidatorTypeName) {
      const bodyParam = this.getBodyParamFromValidator(endpoint);
      parameters.push(bodyParam);
    }

    if (endpoint.queryValidatorMetadata) {
      const queryParam = this.getQueryParamFromValidator(endpoint);
      parameters.push(...queryParam);
    }

    if (endpoint.hasFile) {
      const fileParam = {
        name: 'file',
        in: 'formData',
        description: 'Upload file',
        required: true,
        type: 'file'
      };

      parameters.push(fileParam);
    }

    const pathParams = this.getPathParams(`${basePath}${endpoint.endpointPath}`);
    pathParams.forEach(param => {
      const format = param.includes('Id') ? 'uuid' : undefined;
      parameters.push({
        name: param,
        in: 'path',
        required: true,
        type: 'string',
        format
      });
    });

    if (endpoint.isAuthorizationRequired) {
      const requirementDescription = endpoint.authorizationRequirements.map((requirement: IRequirement) => requirement.name).join(', ');
      parameters.push({
        name: 'x-auth',
        in: 'header',
        description: `JWT access token: ${requirementDescription}`,
        required: false
      });
    }

    return parameters;
  }

  private getBodyParamFromValidator(endpoint: EndpointDescription) {
    return {
      name: endpoint.bodyValidatorTypeName,
      in: 'body',
      description: endpoint.bodyValidatorTypeName,
      required: true,
      schema: {
        $ref: `#/definitions/${endpoint.bodyValidatorTypeName}`
      }
    };
  }

  private getQueryParamFromValidator(endpoint: EndpointDescription) {
    const metadata = endpoint.queryValidatorMetadata;
    const params = [];
    for (const key in metadata) {
      if (!metadata.hasOwnProperty(key)) continue;
      params.push({
        name: key,
        in: 'query',
        description: `${endpoint.queryValidatorTypeName.replace('QueryValidator', '')} ${key}`,
        required: metadata[key][0].always,
        type: this.getTypeFromMetadata(metadata[key][0].type)
      });
    }
    return params;
  }

  private generateRouterDescriptions() {
    const routerDescriptor = new RouterDescriptor();
    this.routerClassTypes.forEach(type => {
      const routerDescription = routerDescriptor.generateFor(type);
      this.routerDescriptions.push(routerDescription);
    });
  }

  private getStatusCode(methodType: MethodType, representation: any): string {
    switch (methodType) {
      case MethodType.post:
        return StatusCode.created.toString();
    }
    if (!representation) {
      return StatusCode.noContent.toString();
    }

    return StatusCode.ok.toString();
  }

  private getParsedPath(path: string) {
    const params = this.getPathParams(path);
    let replacedPath = path;
    params.forEach(param => {
      replacedPath = replacedPath.replace(`:${param}`, `{${param}}`);
    });

    return replacedPath;
  }

  private getPathParams(path: string) {
    return path
      .split('/')
      .filter(param => param.charAt(0) === ':')
      .map(param => param.substr(1, param.length));
  }

  private getTypeFromMetadata(metadataType: string) {
    switch (metadataType) {
      case 'isNumber':
        return 'integer';
      case 'isString':
        return 'string';
      case 'isBoolean':
        return 'boolean';

      default:
        return 'string';
    }
  }

  private getTagFromBasePath(basePath: string) {
    return basePath.substring(basePath.lastIndexOf('/') + 1);
  }

  private secondAttemptAtResolvingArrays() {
    const container = getFromContainer(MetadataStorage);
    Object.keys(this.definitions).forEach(propKey => {
      if (!this.definitions[propKey].properties) {
        return;
      }
      const properties = this.definitions[propKey].properties;

      Object.keys(properties).forEach(key => {
        const property = properties[key];

        if (property.type === 'array' && property.items && property.items.$ref === '#/definitions/Array') {
          const metadataFromTarget = this.metadatas.filter(m => m.target.name === propKey);
          const groupedMetadata = container.groupByPropertyName(metadataFromTarget);
          const nestedValidationMetadata = groupedMetadata[key].find(m => m.type === 'nestedValidation');
          property.items.$ref = `#/definitions/${nestedValidationMetadata.context.name}`;
        }
      });
    });
  }
}

export default SwaggerGenerator;
