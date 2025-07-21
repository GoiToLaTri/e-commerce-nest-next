export interface ProductStatistics {
  id: string;
  model: string;
  averageRating: number;
  ratingCount: number;
  interactions: { action: string; count: number }[];
  totalSold: number;
}
