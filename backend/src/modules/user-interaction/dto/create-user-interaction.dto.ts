export class CreateUserInteractionDto {
  userId: string;
  productId: string;
  action: 'VIEW' | 'PURCHASE' | 'LIKE' | 'ADDTOCART';
}
