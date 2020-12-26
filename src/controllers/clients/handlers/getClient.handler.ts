import Client from 'entities/client.entity';

const getClient = async (clientId: string) => {
  return await Client.getRepository().findOneOrFail(clientId);
};

export default getClient;
