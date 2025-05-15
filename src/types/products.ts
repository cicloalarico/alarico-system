
export interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  brand: string;
  costPrice: number;
  sellPrice: number;
  minSellPrice: number;
  profitMargin: number;
  stock: number;
  minStock: number;
  supplier: string;
  location?: string;
  lastUpdated?: string;
  price?: number;
  quantity?: number;
}

export interface StockMovement {
  id: number;
  productId: number;
  date: string;
  time: string;
  type: "entrada" | "saída";
  quantity: number;
  reason: string;
  document: string;
  user: string;
}
