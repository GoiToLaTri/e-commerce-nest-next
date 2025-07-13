export interface IOrder {
  id: string;
  sessionId: string;
  userId: string;
  isPaid: boolean;
  orderStatus: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  products: IOrderProduct[];
  shippingInfo: IShippingInfo;
  totalAmount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface IOrderProduct {
  productId: string;
  model: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export interface IShippingInfo {
  delivery: "shipping" | "pickup" | string;
  shippingfee: number;
  fullName: string;
  phone: string;
  address: string;
}
