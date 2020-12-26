import PaginatedSearchQueryValidator from 'contracts/validators/query/search.pagination.query.validator';
import UserValidator from 'contracts/validators/user.validator';
import User from 'entities/user.entity';
import ControllerBase from 'utils/controllers/controllerBase';
import description from 'utils/decorators/description';
import deleteById from 'utils/handlers/deleteById.handler';
import { IDictionary } from 'utils/interfaces/IDictionary.interface';
import DataResponse from 'utils/responses/data.response';
import ListResponse from 'utils/responses/list.response';

import getUserList from './handlers/getUserList.handler';
import getUser from './handlers/getUser.handler';
import updateUser from './handlers/updateUser.handler';

export default class UserController extends ControllerBase {
  @description('Gets users for admin')
  public async getList(query: PaginatedSearchQueryValidator) {
    const [items, count] = await getUserList(query);
    return ListResponse.ok(count, items);
  }

  @description('Gets user by id')
  public async getById(body: null, { userId }: IDictionary<string>) {
    const user = await getUser(userId);
    return DataResponse.ok(user);
  }

  @description('Update user by id')
  public async update(body: UserValidator, { userId }: IDictionary<string>) {
    const user = await updateUser(userId, body);
    return DataResponse.ok(user);
  }

  @description('Remove user by id')
  public async delete(body: null, { userId }: IDictionary<string>) {
    await deleteById(User, userId);
  }
}
