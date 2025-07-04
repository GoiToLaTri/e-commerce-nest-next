export class CreateProductDto {
  brand: string;
  model: string;
  description: string;
  cpu: string;
  gpu: string;
  display: string;
  ram: string;
  storage: string;
  thumbnail: { public_id: string; url: string; isTemp: boolean }[];
  imageList: {
    images: {
      public_id: string;
      isTemp: boolean;
      url: string;
      created_at: Date | string;
    }[];
  }[];
  pricing: number;
  quantity: number;
}
