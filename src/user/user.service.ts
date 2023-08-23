import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { v4 } from 'uuid';
import { Payment } from '../payment/models/payment.model';
import { BalanceHistory } from '../balance_history/models/balance_history.model';
import { BalanceHistoryService } from './../balance_history/balance_history.service';
import { PaymentService } from './../payment/payment.service';
import { SpendMoneyDto } from './dto/spend-money.dto';
import { ProductService } from './../product/product.service';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private readonly balanceHistoryService: BalanceHistoryService,
    private readonly paymentService: PaymentService,
    private readonly productService: ProductService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const userByEmail = await this.getUserByEmail(email);
    if (!userByEmail) {
      throw new UnauthorizedException('Email or password is wrong');
    }
    const isMatchPass = await compare(password, userByEmail.hashed_password);
    if (!isMatchPass) {
      throw new UnauthorizedException('Email or password is wrong');
    }
    const token = await this.getToken(userByEmail);
    const user = await this.getOne(userByEmail.id);
    const response = {
      token,
      user,
    };
    return response;
  }

  async create(createUserDto: CreateUserDto) {
    const userByEmail = await this.getUserByEmail(createUserDto.email);
    if (userByEmail) {
      throw new BadRequestException('Email already registered!');
    }
    const hashed_password = await hash(createUserDto.password, 7);
    const user = await this.userRepository.create({
      id: v4(),
      ...createUserDto,
      hashed_password,
    });
    return this.getOne(user.id);
  }

  async findAll() {
    return this.userRepository.findAll({
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'first_name', 'last_name', 'email', 'is_active'],
    });
  }

  async findOne(id: string) {
    return this.getOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.getOne(id);

    if (updateUserDto.email) {
      const UserByEmail = await this.getUserByEmail(updateUserDto.email);
      if (UserByEmail && UserByEmail.id != id) {
        throw new BadRequestException('Email already registered!');
      }
    }

    if (updateUserDto.password) {
      const hashed_password = await hash(updateUserDto.password, 7);
      await this.userRepository.update({ hashed_password }, { where: { id } });
    }

    await this.userRepository.update(updateUserDto, {
      where: { id },
    });
    return this.getOne(id);
  }

  async remove(id: string) {
    await this.getOne(id);
    await this.userRepository.update({ is_active: false }, { where: { id } });
    return this.getOne(id);
  }

  async getOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      order: [
        [{ model: BalanceHistory, as: 'balanceHistory' }, 'createdAt', 'DESC'],
      ],
      attributes: [
        'id',
        'first_name',
        'last_name',
        'balance',
        'email',
        'is_active',
      ],
      include: [
        {
          model: BalanceHistory,
          attributes: ['id', 'money', 'is_added', 'is_active', 'createdAt'],
          include: [
            {
              model: Payment,
              attributes: ['id', 'count', 'is_active'],
            },
          ],
        },
      ],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      attributes: ['id', 'email', 'hashed_password'],
    });
    return user;
  }

  async getToken(user: User) {
    try {
      const jwtPayload = {
        id: user.id,
        email: user.email,
        role: 'USER',
      };
      const token = await this.jwtService.signAsync(jwtPayload, {
        secret: process.env.TOKEN_KEY,
        expiresIn: process.env.TOKEN_TIME,
      });
      return token;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addMoneyToBalance(id: string, money: number) {
    const User = await this.getOne(id);

    const balanceHistory = await this.balanceHistoryService.create({
      money,
      is_added: true,
      user_id: User.id,
    });

    await this.userRepository.update(
      { balance: User.balance + money },
      {
        where: { id },
      },
    );

    return this.balanceHistoryService.getOne(balanceHistory.id);
  }

  async spendMoneyFromBalance(id: string, spendMoneyDto: SpendMoneyDto) {
    const user = await this.getOne(id);
    const product = await this.productService.getOne(spendMoneyDto.product_id);

    if (product.count < spendMoneyDto.count) {
      throw new BadRequestException(
        `There is only ${product.count} products left!`,
      );
    }

    const totalPrice = product.price * spendMoneyDto.count;

    if (user.balance < totalPrice) {
      throw new BadRequestException('There is not enough money!');
    }

    await this.productService.update(spendMoneyDto.product_id, {
      count: product.count - spendMoneyDto.count,
    });

    await this.userRepository.update(
      { balance: user.balance - totalPrice },
      {
        where: { id },
      },
    );

    const balanceHistory = await this.balanceHistoryService.create({
      money: totalPrice,
      is_added: false,
      user_id: user.id,
    });

    await this.paymentService.create({
      ...spendMoneyDto,
      balance_history_id: balanceHistory.id,
    });

    return this.balanceHistoryService.getOne(balanceHistory.id);
  }
}
