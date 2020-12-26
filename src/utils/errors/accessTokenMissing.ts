import Unauthorized from '../responses/errors/unauthorized';

class AccessTokenMissing extends Unauthorized {
  constructor() {
    super('No access token is provided');
  }
}

export default AccessTokenMissing;
