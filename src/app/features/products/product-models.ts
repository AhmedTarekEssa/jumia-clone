export interface ProductDetails {
  productId: number
  name: string
  description: string
  basePrice: number
  discountPercentage: string
  stockQuantity: number,
  isAvailable: boolean
  mainImageUrl: string
  additionalImageUrls: string[]
  attributes: Attribute[]
  variants: Variant[]
}

export interface Attribute {
  attributeId: number
  attributeName: string
  values: string[]
}

export interface Variant {
  variantId: number
  variantName: string
  price: number
  discountPercentage: number
  stockQuantity: number
  sku: string
  variantImageUrl: string
  isDefault: boolean
  isAvailable: boolean
  attributes: Attribute2[]
}

export interface Attribute2 {
  attributeId: number
  attributeName: string
  attributeValue: string
}

export interface ProductUi {
  productId: number
  name: string
  basePrice: number
  discountPercentage: string
  imageUrl: any
  discount?: number
  variants:Variant[]

}

export interface CreateProduct {
  sellerId: number
  categoryId: number
  name: string
  description: string
  basePrice: number
  mainImageUrl: string
  additionalImageUrls: string[]
  attributes: Attribute[]
  variants: Variant[]
}



export interface ProductFilterRequest {
  categoryIds: number[];
  attributeFilters?: Record<string, string>;
  minPrice?: number;
  maxPrice?: number;
}

export interface varinatOptions{
    selectedAttributes:Attribute[]
}

export interface attributeOptions{
    nextOptions:Attribute[]
}

export interface pagedModelUi{
  items:ProductUi[]
  totalCount:number
  totalPages:number
  pageSize:number
}