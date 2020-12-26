import { Column, Entity } from 'typeorm';
import EntityBase from 'utils/entities/base';

@Entity()
export default class Client extends EntityBase {
  @Column()
  public name: string;
}
