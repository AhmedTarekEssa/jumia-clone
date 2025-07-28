export interface Cart {
  cartId: number
  customerId: number
  cartItems: CartItem[]
  totalPrice: number
  totalQuantity: number
}

export interface CartItem {
  cartItemId: number
  productId: number
  productName: string
  mainImageUrl: string
  variationId: number
  variantName: string
  variantImageUrl: string
  unitPrice: number
  discountPercentage: number
  finalPrice: number
  quantity: number
  subtotal: number
}

export interface AddToCart {
  productId: number
  variantId: number|null
  quantity: number
}

export interface UpdateCart {
  quantity: number|undefined
}
