export interface ICheckoutSession {
  id: string;
  sessionId: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    model: string;
    thumbnail: string;
    price: number;
  }[];
  shippingInfo?: {
    delivery: string;
    shippingfee: number;
    fullName: string;
    phone: string;
    address: string[];
    note: string;
  };
  totalAmount: number;
  createdAt: Date | string;
  expiredAt: Date | string;
  isPaid: boolean;
  isUpdate: boolean;
  isCancelled: boolean;
}
