export interface IInventory {
  id: string;
  quantity: number;
  total_imported: number;
  min_alert_quantity: number;
  cost: number;
  product: {
    id: string;
    thumbnail: string;
    model: string;
    price: number;
  };
}

export interface StockImportPayload {
  productId: string;
  product: string;
  supplier: string;
  quantity: number;
  price: number;
  note: string;
}
