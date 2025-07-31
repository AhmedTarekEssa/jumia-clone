export interface ProductDetails {
  productId: number
  name: string
  categoryId:number
  description: string
  basePrice: number
  sellerId:number
  businessLogo:string
  discountPercentage: number
  businessName:string,
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
  variantImageUrl: File|string|null
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
  businessLogo:string
  basePrice: number
  discountPercentage: number
  imageUrl: any
  discount?: number
  isAvailable:boolean
  approvalStatus:string
  stockQuantity:number
  variants:Variant[]

}

export interface CreateProduct {
  sellerId: number
  categoryId: number
  name: string
  description: string
  basePrice: number
  mainImageUrl: File|null
  additionalImageUrls: string[]
  attributes: Attribute[]
  variants: Variant[]
}



export interface ProductFilterRequest {
  categoryIds?: number[];
  attributeFilters?: { [key: string]: string };
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