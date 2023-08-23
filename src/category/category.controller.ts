import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create a Category' })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.CategoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all Category' })
  @Get()
  async findAll() {
    return this.CategoryService.findAll();
  }

  @ApiOperation({ summary: 'Get Category' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.CategoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Category' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.CategoryService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete Category' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.CategoryService.remove(id);
  }
}
