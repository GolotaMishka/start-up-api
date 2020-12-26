import { ClassType } from 'class-transformer/ClassTransformer';
import { createListRepresentation } from 'contracts/representations/list.representation';
import express = require('express');

import ResponseBase from '../utils/responses/responseBase';
import StatusCode from '../utils/responses/statusCode';

const representer = (representationType?: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (request: express.Request, response: express.Response, next: any) => {
    const responseObject = response.body;

    if (!responseObject) {
      response.status(StatusCode.noContent);
      return response.end();
    }

    if (!(responseObject instanceof ResponseBase)) {
      throw new Error('Incorrect response given in route');
    }

    response.status(responseObject.status);

    response.json(responseObject.getFormattedResponse(representationType));
  };
};

export const listRepresenter = (childType?: ClassType<any>) => representer(createListRepresentation(childType));

export default representer;
