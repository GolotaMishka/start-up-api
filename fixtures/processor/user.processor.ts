import hashPassword from '../../src/utils/helpers/hashPassword';
import EntityProcessor from './entity.processor';

export default class UserProcessor extends EntityProcessor {
  public async postProcess(name: string, object: { [key: string]: any }) {
    await super.postProcess(name, object);
    object.password = await hashPassword(object.password);
  }
}
