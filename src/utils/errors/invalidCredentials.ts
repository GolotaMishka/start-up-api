import BadRequest from '../responses/errors/badRequest';

class InvalidCredentials extends BadRequest {
  constructor() {
    super('The provided credentials are incorrect');
  }
}

export default InvalidCredentials;
