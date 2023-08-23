import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { User } from './user/models/user.model';
import { UserModule } from './user/user.module';
import { Category } from './category/models/category.model';
import { CategoryModule } from './category/category.module';
import { Product } from './product/models/product.model';
import { ProductModule } from './product/product.module';
import { ImageModule } from './image/image.module';
import { BalanceHistory } from './balance_history/models/balance_history.model';
import { BalanceHistoryModule } from './balance_history/balance_history.module';
import { Payment } from './payment/models/payment.model';
import { PaymentModule } from './payment/payment.module';
import { Image } from './image/models/image.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: String(process.env.PG_PASSWORD),
      database: process.env.PG_DB,
      autoLoadModels: true,
      logging: false,
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      models: [
        User, 
        BalanceHistory, 
        Category, 
        Product, 
        Image, 
        Payment
      ],
    }),
    UserModule,
    BalanceHistoryModule,
    CategoryModule,
    ProductModule,
    ImageModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
