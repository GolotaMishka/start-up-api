import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import ClientValidator from 'contracts/validators/client.validator';
import Client from 'entities/client.entity';
import ControllerBase from 'utils/controllers/controllerBase';
import description from 'utils/decorators/description';
import deleteById from 'utils/handlers/deleteById.handler';
import { IDictionary } from 'utils/interfaces/IDictionary.interface';
import DataResponse from 'utils/responses/data.response';
import ListResponse from 'utils/responses/list.response';

import getClientList from './handlers/getClientList.handler';
import getClient from './handlers/getClient.handler';
import updateClient from './handlers/updateClient.handler';
import createClient from './handlers/createClient.handler';

export default class ClientController extends ControllerBase {
  @description('Gets clients')
  public async getList(query: PaginatedSearchQueryValidator) {
    const [items, count] = await getClientList(query);
    return ListResponse.ok(count, items);
  }

  @description('Gets client by id')
  public async getById(body: null, { clientId }: IDictionary<string>) {
    const client = await getClient(clientId);
    return DataResponse.ok(client);
  }

  @description('Update client by id')
  public async update(body: ClientValidator, { clientId }: IDictionary<string>) {
    const client = await updateClient(clientId, body);
    return DataResponse.ok(client);
  }

  @description('Create client')
  public async create(body: ClientValidator) {
    const entity = await createClient(body);
    return DataResponse.created(entity);
  }

  @description('Remove client by id')
  public async delete(body: null, { clientId }: IDictionary<string>) {
    await deleteById(Client, clientId);
  }
}
