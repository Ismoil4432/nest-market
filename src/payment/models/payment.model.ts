import {
  Column,
  DataType,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { BalanceHistory } from '../../balance_history/models/balance_history.model';
import { Product } from '../../product/models/product.model';

interface PaymentAttr {
  id: string;
  count: number;
  is_active: boolean;
  product_id: string;
  balance_history_id: string;
}

@Table({ tableName: 'payment' })
export class Payment extends Model<Payment, PaymentAttr> {
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @Column({ type: DataType.INTEGER })
  count: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean;

  @ForeignKey(() => Product)
  @Column({ type: DataType.STRING })
  product_id: string;

  @ForeignKey(() => BalanceHistory)
  @Column({ type: DataType.STRING })
  balance_history_id: string;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => BalanceHistory)
  balanceHistory: BalanceHistory;
}
