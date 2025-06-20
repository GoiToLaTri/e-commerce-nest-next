import {
  Controller,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IImage } from './interfaces';

@Controller('upload')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @Post('product-image')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadProductImage(@UploadedFiles() files: Array<Express.Multer.File>) {
    const listImages: Array<IImage> = [];
    const imagesData = await this.cloudinaryService.upload(files, 'product');
    imagesData.forEach((image) => {
      const { id, public_id, url } = image;
      listImages.push({
        id,
        public_id,
        is_temp: true,
        is_thumbnail: false,
        url,
      });
    });
    await this.cloudinaryService.save(listImages);
    return { statusCode: HttpStatus.CREATED, images: listImages };
  }

  @Post('product-thumbnail')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadProductThumbnail(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const listImages: Array<IImage> = [];
    const imagesData = await this.cloudinaryService.upload(files, 'thumbnails');
    imagesData.forEach((image) => {
      const { id, public_id, url } = image;
      listImages.push({
        id,
        public_id,
        is_temp: true,
        is_thumbnail: true,
        url,
      });
    });
    await this.cloudinaryService.save(listImages);
    return { statusCode: HttpStatus.CREATED, images: listImages };
  }
}
