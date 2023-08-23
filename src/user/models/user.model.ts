import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { BalanceHistory } from './../../balance_history/models/balance_history.model';

interface UserAttr {
  id: string;
  first_name: string;
  last_name: string;
  balance: number;
  email: string;
  hashed_password: string;
  is_active: boolean;
}

@Table({ tableName: 'user' })
export class User extends Model<User, UserAttr> {
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING })
  first_name: string;

  @Column({ type: DataType.STRING })
  last_name: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  balance: number;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  hashed_password: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean;

  @HasMany(() => BalanceHistory)
  balanceHistory: BalanceHistory[];
}
