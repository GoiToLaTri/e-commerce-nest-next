import { ReviewStatus } from "@/common/enums";

export interface CreateReviewPayload {
  productId: string;
  userId: string;
  productName: string;
  customerName: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  status?: ReviewStatus;
}

export interface Review extends CreateReviewPayload {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
