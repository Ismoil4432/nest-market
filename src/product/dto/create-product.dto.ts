import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Laptop',
    description: 'The title of the Product',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Some description',
    description: 'The description of the Product',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 175000,
    description: 'The price of the Product',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 120,
    description: 'The count of the Product',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  count: number;

  @ApiProperty({
    example: '87b44d67-3ee7-4a1a-9f6e-0107bffd044d',
    description: 'The category ID of the Product',
  })
  @IsNotEmpty()
  @IsString()
  category_id: string;
}
