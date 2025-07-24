import { OrderStatus } from 'generated/prisma';

export interface OrderStatusStats {
  status: OrderStatus;
  count: number;
  percentage: number;
  totalAmount: number;
}
