import LoginValidator from 'contracts/validators/login.validator';
import ControllerBase from 'utils/controllers/controllerBase';
import DataResponse from 'utils/responses/data.response';

import description from '../../utils/decorators/description';
import login from './handlers/login.handler';

export default class AuthenticationController extends ControllerBase {
  @description('Logs in a user')
  public async login(body: LoginValidator) {
    const { tokenData } = await login(body);
    this.context.response.header('x-auth', tokenData.token);

    return DataResponse.ok();
  }
}
