export class CreateCheckoutSessionDto {
  products: Product[];
}

interface Product {
  productId: string;
  quantity: number;
}
