export interface IInventoryLog {
  id: string;
  data: IInventoryLogData[];
  total: number;
  totalPages: number;
}

export interface IInventoryLogData {
  change_type: string;
  created_at: Date | string;
  created_by: null;
  id: string;
  productId: string;
  quantity_change: number;
  reference: string;
  product_name: string;
  supplier_name: string;
}
