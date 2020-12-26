import Client from 'entities/client.entity';
import ClientValidator from 'contracts/validators/client.validator';

const createClient = (input: ClientValidator) => {
  const client = Client.create(input);

  return client.save();
};

export default createClient;
