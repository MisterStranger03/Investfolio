export interface Stock {
  _id: string;
  name: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  purchaseDate: string;
  user: string;
}

export type NewStock = Omit<Stock, '_id' | 'purchaseDate' | 'user'>;

export interface EnhancedStock extends Stock {
  currentPrice: number | null;
  investedAmount: number;
  currentValue: number | null;
  gainLoss: number | null;
  gainLossPercent: number | null;
  dayChange: number | null;
  dayChangePercent: number | null;
  individualPurchases: Stock[]; 
  isExpanded: boolean; 
}