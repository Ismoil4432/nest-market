import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Gadgets',
    description: 'The name of the Category',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: true,
    description: 'The status of the Category',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
