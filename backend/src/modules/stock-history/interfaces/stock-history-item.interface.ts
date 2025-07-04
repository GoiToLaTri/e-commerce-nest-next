export interface StockHistoryItem {
  id: string;
  type: 'import' | 'export' | 'adjustment';
  quantity: number;
  import_price?: number;
  supplier_name?: string;
  reason?: string;
  reference?: string;
  note?: string;
  old_quantity?: number;
  new_quantity?: number;
  created_by?: string;
  created_at: Date;
  Product: {
    id: string;
    modal: string;
  };
}
