import UserRepresentation from 'contracts/representations/user.representation';
import LoginValidator from 'contracts/validators/login.validator';
import AuthenticationController from 'controllers/authentication/authentication.controller';
import { Router } from 'express';
import bodyValidator from 'middleware/bodyValidation.middleware';
import presenter from 'middleware/represent.middleware';
import { Delegator } from 'utils/controllers/delegator';
import IRouter from 'utils/interfaces/router.interface';

class AuthenticationRouter implements IRouter {
  public router: Router = Router();
  public path = 'authentication';

  constructor() {
    const delegator = new Delegator(AuthenticationController);
    const { login } = delegator.getFunctions();

    this.router.post('/login', bodyValidator(LoginValidator), login, presenter(UserRepresentation));
  }
}

export default AuthenticationRouter;
