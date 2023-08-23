import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateBalanceHistoryDto } from './dto/create-balance_history.dto';
import { UpdateBalanceHistoryDto } from './dto/update-balance_history.dto';
import { BalanceHistory } from './models/balance_history.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from './../user/user.service';
import { v4 } from 'uuid';
import { User } from '../user/models/user.model';
import { Payment } from '../payment/models/payment.model';

@Injectable()
export class BalanceHistoryService {
  constructor(
    @InjectModel(BalanceHistory)
    private balanceHistoryRepository: typeof BalanceHistory,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async create(createBalanceHistoryDto: CreateBalanceHistoryDto) {
    await this.userService.getOne(createBalanceHistoryDto.user_id);

    const balanceHistory = await this.balanceHistoryRepository.create({
      id: v4(),
      ...createBalanceHistoryDto,
    });
    return this.getOne(balanceHistory.id);
  }

  async findAll() {
    return this.balanceHistoryRepository.findAll({
      order: [['createdAt', 'DESC']],
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
        {
          model: Payment,
          attributes: ['id', 'count', 'is_active'],
        },
      ],
    });
  }

  async findOne(id: string) {
    return this.getOne(id);
  }

  async update(id: string, updateBalanceHistoryDto: UpdateBalanceHistoryDto) {
    await this.getOne(id);

    await this.balanceHistoryRepository.update(updateBalanceHistoryDto, {
      where: { id },
    });
    return this.getOne(id);
  }

  async remove(id: string) {
    await this.getOne(id);
    await this.balanceHistoryRepository.update(
      { is_active: false },
      { where: { id } },
    );
    return this.getOne(id);
  }

  async getOne(id: string) {
    const balanceHistory = await this.balanceHistoryRepository.findOne({
      where: { id },
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
        {
          model: Payment,
          attributes: ['id', 'count', 'is_active'],
        },
      ],
    });
    if (!balanceHistory) {
      throw new HttpException(
        'Balance History not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return balanceHistory;
  }
}
