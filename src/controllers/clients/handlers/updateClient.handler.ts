import ClientValidator from 'contracts/validators/client.validator';
import Client from 'entities/client.entity';

const updateClient = async (clientId: string, clientData: Partial<ClientValidator>) => {
  const client = await Client.getRepository().findOneOrFail(clientId);
  client.merge(clientData);

  return client.save();
};

export default updateClient;
