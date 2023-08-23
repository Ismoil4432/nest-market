import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { v4 } from 'uuid';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/models/category.model';
import { Image } from '../image/models/image.model';
import { ImageService } from '../image/image.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Image) private imageRepository: typeof Image,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    private readonly imageService: ImageService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    await this.categoryService.getOne(createProductDto.category_id);

    const allSlug = await this.productRepository.findAll({
      attributes: ['slug'],
    });

    const slug = await this.createSlug(createProductDto.title);

    if (allSlug.map((item) => item.slug).includes(slug)) {
      throw new BadRequestException('Slug for this title already exists!');
    }

    const product = await this.productRepository.create({
      id: v4(),
      slug,
      ...createProductDto,
    });
    return this.getOne(product.id);
  }

  async findAll() {
    return this.productRepository.findAll({
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'title',
        'description',
        'slug',
        'price',
        'count',
        'is_active',
      ],
      include: [
        {
          model: Category,
          attributes: ['id', 'name', 'slug', 'is_active'],
        },
        {
          model: Image,
          attributes: ['image_name'],
        },
      ],
    });
  }

  async findOne(id: string) {
    return this.getOne(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.getOne(id);

    if (updateProductDto.title) {
      const allSlug = await this.productRepository.findAll({
        attributes: ['slug'],
      });

      const slug = await this.createSlug(updateProductDto.title);

      if (
        product.slug != slug &&
        allSlug.map((item) => item.slug).includes(slug)
      ) {
        throw new BadRequestException('Slug for this title already exists!');
      }

      await this.productRepository.update(
        { slug },
        {
          where: { id },
        },
      );
    }

    await this.productRepository.update(updateProductDto, {
      where: { id },
    });
    return this.getOne(id);
  }

  async remove(id: string) {
    await this.getOne(id);
    await this.productRepository.update(
      { is_active: false },
      { where: { id } },
    );
    return this.getOne(id);
  }

  async addImage(id: string, image: Express.Multer.File) {
    await this.getOne(id);

    const fileName = await this.imageService.create(image);

    await this.imageRepository.create({
      id: v4(),
      image_name: fileName,
      product_id: id,
    });

    return fileName;
  }

  async removeImage(id: string, fileName: string) {
    const image = await this.imageRepository.findOne({
      where: { image_name: fileName, product_id: id },
    });

    if (!image) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }

    await image.destroy();
    return this.imageService.remove(fileName);
  }

  async getOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      attributes: [
        'id',
        'title',
        'description',
        'slug',
        'price',
        'count',
        'is_active',
      ],
      include: [
        {
          model: Category,
          attributes: ['id', 'name', 'slug', 'is_active'],
        },
        {
          model: Image,
          attributes: ['image_name'],
        },
      ],
    });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
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
