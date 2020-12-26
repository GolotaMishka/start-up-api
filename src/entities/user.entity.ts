import UserValidator from 'contracts/validators/user.validator';
import { Column, Entity } from 'typeorm';
import EntityBase from '../utils/entities/base';
import hashPassword from '../utils/helpers/hashPassword';

@Entity()
export default class User extends EntityBase {
  public static async init(userValidator: UserValidator): Promise<User> {
    const user = User.create(userValidator);

    await user.setPassword(userValidator.password);
    return user.save();
  }

  @Column({ unique: true })
  public email: string;

  @Column()
  public isAdmin: boolean;

  @Column({ nullable: true })
  public password?: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column({ nullable: true })
  public phoneNumber?: string;

  public async setPassword(password: string) {
    this.password = await hashPassword(password);
  }
}
