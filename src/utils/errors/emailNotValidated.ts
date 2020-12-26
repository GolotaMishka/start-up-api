import BadRequest from '../responses/errors/badRequest';

class EmailNotValidated extends BadRequest {
  constructor() {
    super('Email address is not yet validated');
  }
}

export default EmailNotValidated;
