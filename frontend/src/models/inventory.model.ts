export interface IInventory {
  id: string;
  quantity: number;
  total_imported: number;
  total_exported: number;
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

export interface StockExportPayload {
  product: string;
  productId: string;
  quantity: number;
  reason: string;
  note: string;
}

export interface StockAdjustmentPayload {
  productId: string;
  product: string;
  system_stock: number;
  actual_stock: number;
  note: string;
}
