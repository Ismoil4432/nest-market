import { Module, forwardRef } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Product } from "./models/product.model";
import { CategoryModule } from "../category/category.module";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { ImageModule } from "../image/image.module";
import { Image } from "../image/models/image.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Product, Image]),
    forwardRef(() => CategoryModule),
    forwardRef(() => ImageModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
