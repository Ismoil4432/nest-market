import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateBalanceHistoryDto {
  @ApiProperty({
    example: true,
    description: 'The status of the Balance History',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
