import { Request } from 'express';
import InsufficientRights from 'utils/responses/errors/insufficientRights';

import getAbsoluteIdFromString from '../helpers/getAbsoluteIdFromString';
import IRequirement from './requirement.interface';

const userRequirement: IRequirement = (req: Request) => {
  if (getAbsoluteIdFromString(req.token.userId) === getAbsoluteIdFromString(req.params.userId)) {
    return;
  }
  throw new InsufficientRights('Not enough rights', 'NoAccessToUser');
};

export default userRequirement;
