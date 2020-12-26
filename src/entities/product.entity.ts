import { Column, Entity, ManyToOne } from 'typeorm';

import EntityBase from '../utils/entities/base';
import Client from './client.entity';

@Entity()
export default class Product extends EntityBase {
  @Column()
  public name: string;

  @Column()
  public active: boolean;

  @Column()
  public userReporting: boolean;

  @ManyToOne(() => Client, { onDelete: 'SET NULL', cascade: true })
  public client!: Client;
}
