import {
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Payment } from '../../payment/models/payment.model';
import { User } from '../../user/models/user.model';

interface BalanceHistoryAttr {
  id: string;
  money: number;
  is_added: boolean;
  is_active: boolean;
  user_id: string;
}

@Table({ tableName: 'balance_history' })
export class BalanceHistory extends Model<BalanceHistory, BalanceHistoryAttr> {
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @Column({ type: DataType.INTEGER })
  money: number;

  @Column({ type: DataType.BOOLEAN })
  is_added: boolean;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING })
  user_id: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Payment)
  payment: Payment;
}
