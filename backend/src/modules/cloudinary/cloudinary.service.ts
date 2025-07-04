import { appConfig } from '@/common/configs';
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { IImage } from './interfaces';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CloudinaryService {
  constructor(private readonly prisma: PrismaService) {
    cloudinary.config({
      cloud_name: appConfig.CLOUDINARY_CLOUD_NAME,
      api_key: appConfig.CLOUDINARY_API_KEY,
      api_secret: appConfig.CLOUDINARY_API_SECRET,
    });
  }

  async upload(files: Array<Express.Multer.File>, folderName: string) {
    try {
      const uploadResults: Array<IImage> = [];
      if (!files) return uploadResults;

      for (const file of files) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: folderName,
              public_id: `${file.originalname.replace(/\.[^/.]+$/, '')}_${new Date().getTime()}`,
            },
            (error, result) => {
              if (error) return reject(error as Error);
              return resolve(result);
            },
          );
          stream.end(file.buffer);
        });
        console.log(`Upload image ${file.originalname} sucsess.`);
        uploadResults.push(uploadResult as IImage);
      }

      return uploadResults;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error instanceof Error
        ? error
        : new Error('Image upload failed. Please try again.'); // Ném lỗi với thông báo tùy chỉnh
    }
  }

  async remove(
    images: Pick<IImage, 'public_id'>[],
  ): Promise<Array<{ result: string }>> {
    try {
      const removeResults: Array<{ result: string }> = [];
      for (const image of images) {
        const removeResult = await new Promise<{ result: string }>(
          (resolve, reject) => {
            void cloudinary.uploader.destroy(
              image.public_id,
              (error, result) => {
                if (error) return reject(error as Error); // Nếu có lỗi, reject lỗi
                return resolve(result as { result: string }); // Nếu thành công, resolve kết quả
              },
            );
          },
        );
        console.log(`Remove image ${image.public_id} success`);
        removeResults.push(removeResult);
      }
      return removeResults;
    } catch (error) {
      console.error('Image deletion failed:', error);
      throw error instanceof Error
        ? error
        : new Error('Image deletion failed. Please try again.'); // Ném lỗi với thông báo tùy chỉnh}
    }
  }

  save(images: IImage[]) {
    return this.prisma.images.createMany({
      data: images,
    });
  }

  findByPublicIdAndUpdate(public_id: string, data: Partial<IImage>) {
    console.log(public_id);
    return this.prisma.images.update({
      where: { public_id },
      data: { ...data },
    });
  }

  updateMany(public_ids: string[], data: Partial<IImage>) {
    return this.prisma.images.updateMany({
      where: { public_id: { in: public_ids } },
      data: { ...data },
    });
  }
}
