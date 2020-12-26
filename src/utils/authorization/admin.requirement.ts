import { Request } from 'express';
import IAccessTokenData from 'utils/interfaces/accessTokenData.interface';

import InsufficientRights from '../responses/errors/insufficientRights';
import IRequirement from './requirement.interface';

const adminRequirement: IRequirement = (req: Request) => {
  if ((req.token as IAccessTokenData).isAdmin) {
    return;
  }
  throw new InsufficientRights();
};

export default adminRequirement;
