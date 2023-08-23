import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    example: 'Laptop',
    description: 'The title of the Product',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the Product',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 175000,
    description: 'The price of the Product',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    example: 120,
    description: 'The count of the Product',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  count?: number;

  @ApiProperty({
    example: true,
    description: 'The status of the Product',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({
    example: '87b44d67-3ee7-4a1a-9f6e-0107bffd044d',
    description: 'The category ID of the Product',
  })
  @IsOptional()
  @IsString()
  category_id?: string;
}
