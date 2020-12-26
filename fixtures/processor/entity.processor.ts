import { BaseEntity } from 'typeorm';
import { IProcessor } from 'typeorm-fixtures-cli';

import createSimpleUuid from '../../src/utils/helpers/createSimpleUuid';

export default class EntityProcessor implements IProcessor<BaseEntity> {
  public postProcess(name: string, object: { [key: string]: any }) {
    object.id = createSimpleUuid(object.id);
  }
}
