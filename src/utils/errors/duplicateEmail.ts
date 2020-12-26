import Conflict from '../responses/errors/conflict';

class DuplicateEmail extends Conflict {
  constructor(message: string = 'The provided email address is already in use.') {
    super(message);
  }
}

export default DuplicateEmail;
