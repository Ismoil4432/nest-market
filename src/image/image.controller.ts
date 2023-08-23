import { Controller, Get, Param, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: 'Get All file name of Image' })
  @Get()
  async findAll() {
    return this.imageService.findAll();
  }

  @ApiOperation({ summary: 'Get Image by file name' })
  @Get(':fileName')
  async findOne(@Param('fileName') fileName: string, @Res() res: Response) {
    return this.imageService.findOne(fileName, res);
  }
}
