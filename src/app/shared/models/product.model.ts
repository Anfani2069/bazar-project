export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  emoji?: string;
  category?: string;
  badge?: 'best-seller' | 'new' | 'promo';
  originalPrice?: number;
  unit?: string;
}
