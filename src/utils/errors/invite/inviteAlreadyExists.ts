import BadRequest from 'utils/responses/errors/badRequest';
import Conflict from 'utils/responses/errors/conflict';

class InviteAlreadyExists extends Conflict {
  constructor() {
    super('Invite already exists');
  }
}

export default InviteAlreadyExists;
