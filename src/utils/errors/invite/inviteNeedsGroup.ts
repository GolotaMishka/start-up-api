import BadRequest from 'utils/responses/errors/badRequest';

class InviteNeedsGroup extends BadRequest {
  constructor(role) {
    super(`Invite with role ${role} needs to be a group invite`);
  }
}

export default InviteNeedsGroup;
