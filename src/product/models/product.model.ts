import {
  Column,
  DataType,
  HasMany,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Image } from '../../image/models/image.model';
import { Payment } from '../../payment/models/payment.model';
import { Category } from '../../category/models/category.model';

interface ProductAttr {
  id: string;
  title: string;
  description: string;
  slug: string;
  price: number;
  count: number;
  is_active: boolean;
  category_id: string;
}

@Table({ tableName: 'product' })
export class Product extends Model<Product, ProductAttr> {
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING })
  title: string;

  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.STRING })
  slug: string;

  @Column({ type: DataType.INTEGER })
  price: number;

  @Column({ type: DataType.INTEGER })
  count: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean;

  @ForeignKey(() => Category)
  @Column({ type: DataType.STRING })
  category_id: string;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => Image)
  image: Image[];

  @HasMany(() => Payment)
  payment: Payment[];
}
