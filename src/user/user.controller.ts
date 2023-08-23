import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddMoneytDto } from './dto/add-money.dto';
import { SpendMoneyDto } from './dto/spend-money.dto';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Login User' })
  @Post('signin')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @ApiOperation({ summary: 'Create a User' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all User' })
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get User' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Update User' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete User' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @ApiOperation({ summary: 'Add money to Balance' })
  @Post(':id/money/add')
  async addMoneyToBalance(
    @Param('id') id: string,
    @Body() addMoneytDto: AddMoneytDto,
  ) {
    return this.userService.addMoneyToBalance(id, addMoneytDto.money);
  }

  @ApiOperation({ summary: 'Spend money from Balance' })
  @Post(':id/money/spend')
  async spendMoneyFromBalance(
    @Param('id') id: string,
    @Body() spendMoneyDto: SpendMoneyDto,
  ) {
    return this.userService.spendMoneyFromBalance(id, spendMoneyDto);
  }
}
