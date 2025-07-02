import { IFlatProduct } from './flat-product.interface';

export interface IRecommendationResult {
  productId: string;
  score: number;
  product: IFlatProduct[];
}
