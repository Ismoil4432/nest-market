import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { v4 } from 'uuid';
import { Product } from '../product/models/product.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const allSlug = await this.categoryRepository.findAll({
      attributes: ['slug'],
    });

    const slug = await this.createSlug(createCategoryDto.name);

    if (allSlug.map((item) => item.slug).includes(slug)) {
      throw new BadRequestException('Slug for this name already exists!');
    }

    const category = await this.categoryRepository.create({
      id: v4(),
      slug,
      ...createCategoryDto,
    });
    return this.getOne(category.id);
  }

  async findAll() {
    return this.categoryRepository.findAll({
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'name', 'slug', 'is_active'],
      include: [
        {
          model: Product,
          attributes: [
            'id',
            'title',
            'description',
            'slug',
            'price',
            'count',
            'is_active',
          ],
        },
      ],
    });
  }

  async findOne(id: string) {
    return this.getOne(id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.getOne(id);

    if (updateCategoryDto.name) {
      const allSlug = await this.categoryRepository.findAll({
        attributes: ['slug'],
      });

      const slug = await this.createSlug(updateCategoryDto.name);

      if (
        category.slug != slug &&
        allSlug.map((item) => item.slug).includes(slug)
      ) {
        throw new BadRequestException('Slug for this name already exists!');
      }

      await this.categoryRepository.update(
        { slug },
        {
          where: { id },
        },
      );
    }

    await this.categoryRepository.update(updateCategoryDto, {
      where: { id },
    });
    return this.getOne(id);
  }

  async remove(id: string) {
    await this.getOne(id);
    await this.categoryRepository.update(
      { is_active: false },
      { where: { id } },
    );
    return this.getOne(id);
  }

  async getOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      attributes: ['id', 'name', 'slug', 'is_active'],
      include: [
        {
          model: Product,
          attributes: [
            'id',
            'title',
            'description',
            'slug',
            'price',
            'count',
            'is_active',
          ],
        },
      ],
    });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async createSlug(name: string) {
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    return slug;
  }
}
