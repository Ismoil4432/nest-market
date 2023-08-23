import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddMoneytDto {
  @ApiProperty({
    example: 175000,
    description: 'The amount of money to add',
  })
  @IsNotEmpty()
  @IsNumber()
  money: number;
}
