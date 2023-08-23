import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from '../../product/models/product.model';

interface CategoryAttr {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

@Table({ tableName: 'category' })
export class Category extends Model<Category, CategoryAttr> {
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING })
  slug: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  is_active: boolean;

  @HasMany(() => Product)
  product: Product[];
}
