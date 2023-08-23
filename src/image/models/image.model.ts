import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Product } from '../../product/models/product.model';

interface ImageAttr {
  id: string;
  image_name: string;
  product_id: string;
}

@Table({ tableName: 'image' })
export class Image extends Model<Image, ImageAttr> {
  @Column({ type: DataType.STRING, primaryKey: true })
  id: string;

  @Column({ type: DataType.STRING })
  image_name: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.STRING })
  product_id: string;

  @BelongsTo(() => Product)
  product: Product;
}
