import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    example: 10,
    description: 'The count of the Payment',
  })
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @ApiProperty({
    example: 'f68b71d0-a07f-4dd6-bf12-bbc6aaeb510a',
    description: 'The product ID of the Payment',
  })
  @IsNotEmpty()
  @IsString()
  product_id: string;

  @ApiProperty({
    example: 'f68b71d0-a07f-4dd6-bf12-bbc6aaeb510a',
    description: 'The balance history ID of the Payment',
  })
  @IsNotEmpty()
  @IsString()
  balance_history_id: string;
}
