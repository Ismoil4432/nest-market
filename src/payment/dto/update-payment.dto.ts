import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePaymentDto {
  @ApiProperty({
    example: true,
    description: 'The status of the Payment',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
