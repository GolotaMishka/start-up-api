import { Column, Entity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

import EntityBase from '../utils/entities/base';
import Product from './product.entity';
import Metric from './metric.entity';

@Entity()
export default class ProductMetric extends EntityBase {
  @Column()
  public value: string;

  @Column()
  public restricted: boolean;

  @Column()
  public timeStamp: Date;

  @OneToOne(() => Metric, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  public metric!: Metric;

  @ManyToOne(() => Product, { onDelete: 'SET NULL' })
  public product!: Product;
}
