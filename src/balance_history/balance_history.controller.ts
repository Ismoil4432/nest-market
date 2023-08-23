import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { BalanceHistoryService } from './balance_history.service';
import { UpdateBalanceHistoryDto } from './dto/update-balance_history.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Balance History')
@Controller('balance-history')
export class BalanceHistoryController {
  constructor(private readonly balanceHistoryService: BalanceHistoryService) {}

  @ApiOperation({ summary: 'Get all Balance History' })
  @Get()
  async findAll() {
    return this.balanceHistoryService.findAll();
  }

  @ApiOperation({ summary: 'Get Balance History' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.balanceHistoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Balance History' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBalanceHistoryDto: UpdateBalanceHistoryDto,
  ) {
    return this.balanceHistoryService.update(id, updateBalanceHistoryDto);
  }

  @ApiOperation({ summary: 'Delete Balance History' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.balanceHistoryService.remove(id);
  }
}
