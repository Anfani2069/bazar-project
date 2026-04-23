export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId:  string;
  name:       string;
  price:      number;
  quantity:   number;
  emoji?:     string;
  imageUrl?:  string;
}

export interface Order {
  id:     string;
  date:   string;
  status: OrderStatus;
  customer: {
    prenom:        string;
    nom:           string;
    telephone:     string;
    email?:        string;
    ile:           string;
    ville:         string;
    adresse:       string;
    instructions?: string;
  };
  delivery: { method: string; label: string; cost: number };
  payment:  { method: string; label: string };
  items:    OrderItem[];
  subtotal: number;
  total:    number;
}
