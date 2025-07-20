export class CreateReviewDto {
  productId: string;
  userId: string;
  productName: string;
  customerName: string;
  rating: number;
  title?: string;
  content: string;
  images?: any;
}
