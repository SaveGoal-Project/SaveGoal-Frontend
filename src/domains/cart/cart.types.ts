// Cart Types — defines the structure for the shopping cart feature

export type CartFrequency = "WEEKLY" | "BIWEEKLY" | "MONTHLY";

export interface CartItem {
  id: string; // unique cart item id (generated on add)
  productId: string;
  productName: string;
  productImage: string | null;
  merchantName: string | null;
  price: number; // product total price in GHS
  frequency: CartFrequency;
  months: number; // number of months (1-5), applicable only for MONTHLY
  perPayment: number; // calculated payment per period
  addedAt: string; // ISO date string
}
