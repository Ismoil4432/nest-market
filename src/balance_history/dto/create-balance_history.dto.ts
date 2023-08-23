import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBalanceHistoryDto {
  @ApiProperty({
    example: 175000,
    description: 'The money of the Balance History',
  })
  @IsNotEmpty()
  @IsNumber()
  money: number;

  @ApiProperty({
    example: true,
    description:
      'The action status of the Balance History. If money is added then true, if money is paid for course then false',
  })
  @IsNotEmpty()
  @IsBoolean()
  is_added: boolean;

  @ApiProperty({
    example: 'f68b71d0-a07f-4dd6-bf12-bbc6aaeb510a',
    description: 'The user ID of the Balance History',
  })
  @IsNotEmpty()
  @IsString()
  user_id: string;
}
