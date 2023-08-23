import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the User',
  })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the User',
  })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({
    example: 'john@gmail.com',
    description: 'The email of the User',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'user',
    description: 'The password of the User',
  })
  @IsOptional()
  @IsString()
  password?: string;
}
