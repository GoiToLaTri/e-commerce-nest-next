export interface IUserInteraction {
  id: string;
  userId: string;
  productId: string;
  action: string;
  created_at: Date | string;
  updated_at: Date | string;
}
