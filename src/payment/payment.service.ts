import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './models/payment.model';
import { v4 } from 'uuid';
import { BalanceHistory } from '../balance_history/models/balance_history.model';
import { Product } from '../product/models/product.model';
import { Category } from '../category/models/category.model';
import { Image } from '../image/models/image.model';
import { User } from '../user/models/user.model';
import { ProductService } from '../product/product.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment) private paymentRepository: typeof Payment,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    await this.productService.getOne(createPaymentDto.product_id);

    const payment = await this.paymentRepository.create({
      id: v4(),
      ...createPaymentDto,
    });
    return this.getOne(payment.id);
  }

  async findAll() {
    return this.paymentRepository.findAll({
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'count', 'is_active'],
      include: [
        {
          model: Product,
          attributes: [
            'id',
            'title',
            'description',
            'slug',
            'price',
            'count',
            'is_active',
          ],
        },
        {
          model: BalanceHistory,
          attributes: ['id', 'money', 'is_added', 'is_active', 'createdAt'],
        },
      ],
    });
  }

  async findOne(id: string) {
    return this.getOne(id);
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    await this.getOne(id);

    await this.paymentRepository.update(updatePaymentDto, {
      where: { id },
    });
    return this.getOne(id);
  }

  async remove(id: string) {
    await this.getOne(id);
    await this.paymentRepository.update(
      { is_active: false },
      { where: { id } },
    );
    return this.getOne(id);
  }

  async getOne(id: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      attributes: ['id', 'count', 'is_active'],
      include: [
        {
          model: Product,
          attributes: [
            'id',
            'title',
            'description',
            'slug',
            'price',
            'count',
            'is_active',
          ],
          include: [
            {
              model: Category,
              attributes: ['id', 'name', 'slug', 'is_active'],
            },
            {
              model: Image,
              attributes: ['image_name'],
            },
          ],
        },
        {
          model: BalanceHistory,
          attributes: ['id', 'money', 'is_added', 'is_active', 'createdAt'],
          include: [
            {
              model: User,
              attributes: [
                'id',
                'first_name',
                'last_name',
                'balance',
                'email',
                'is_active',
              ],
            },
          ],
        },
      ],
    });
    if (!payment) {
      throw new HttpException('Payment not found', HttpStatus.NOT_FOUND);
    }
    return payment;
  }
}
