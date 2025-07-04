export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

export interface ICart {
  id: string;
  userId: string;
  items: CartProduct[];
  updatedAt: Date | string;
}

export interface CartDataResponse {
  id: string;
  userId: string;
  data: ICart;
}

export interface CartProduct {
  id: string;
  priceAtAdded: number;
  quantity: number;
  product: {
    model: string;
    thumbnail: string;
  };
}
