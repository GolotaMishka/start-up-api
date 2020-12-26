import { Column, Entity } from 'typeorm';

import EntityBase from '../utils/entities/base';

@Entity()
export default class Metric extends EntityBase {
  @Column()
  public value: string;

  @Column()
  public type: string;
}
