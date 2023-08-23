import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Get all Payment' })
  @Get()
  async findAll() {
    return this.paymentService.findAll();
  }

  @ApiOperation({ summary: 'Get Payment' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Payment' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @ApiOperation({ summary: 'Delete Payment' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }
}
