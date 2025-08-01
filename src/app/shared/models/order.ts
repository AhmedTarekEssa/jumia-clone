export interface Order {
  orderId: number;
  customerId: number;
  addressId: number;
  couponId: number | null;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'; // Enum-like type
  createdAt: string | Date;
  updatedAt: string | Date;
  affiliateId: number | null;
  affiliateCode: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // Enum-like type
  subOrders: SubOrder[];
}

export interface SubOrder {
  id: number;
  orderId: number;
  sellerId: number;
  subtotal: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  statusUpdatedAt: string | Date;
  trackingNumber: string | null;
  shippingProvider: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  subOrderId: number;
  productId: number;
  variationId: number;
  quantity: number;
  priceAtPurchase: number;
  totalPrice: number;
  productName: string;
  mainImageUrl: string | null;
  productSlug: string | null;
  productBrand: string | null;
  productCategory: string | null;
}
