

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
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string | Date;
  updatedAt: string | Date;
  affiliateId: number | null;
  affiliateCode: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subOrders: SubOrder[];
}

export interface Address {
  firstName?: string;
  lastName?: string;
  addressId?: number;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault: boolean;
  addressName: string;
}
export interface paymentResponse {
    success: boolean;
    paymentUrl: string;
    transactionId?: string;  // Optional property (nullable)
    message: string;
}
export interface CartItem {
  id: number;
  productId: number;
  variantId: number;
  discountPercentage: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
export interface OrderPayload {
  customerId: number;
  addressId: number;
  totalAmount: number;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  paymentMethod: string;
  subOrders: SubOrder[];
}

export interface SubOrder {
  sellerId: number;
  subtotal: number;
  status: string;
  statusUpdatedAt: string;
  orderItems: IOrderItem[];
}

export interface IOrderItem {
  productId: number;
  variationId: number;
  quantity: number;
  productName: string;
  priceAtPurchase: number;
  totalPrice: number;
  mainImageUrl:string
}



export interface DeliveryOption {
  type: 'pickup' | 'door';
  name: string;
  price: number;
  description: string;
  selected: boolean;
}
