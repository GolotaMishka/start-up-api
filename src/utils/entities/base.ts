import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

class EntityBase extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  public merge?(validator: object) {
    Object.keys(validator).map(key => {
      if (validator[key] !== undefined) {
        this[key] = validator[key];
      }
    });

    return this;
  }
}

export default EntityBase;
