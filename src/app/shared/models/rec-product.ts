export interface RecProduct {
  productId: number;
  name: string;
  sellerId: number;
  businessName: string | null;
  businessDescription: string | null;
  categoryId: number;
  description: string;
  basePrice: number;
  discountPercentage: number;
  stockQuantity: number;
  isAvailable: boolean;
  mainImageUrl: string;
  additionalImageUrls: string[];
  attributes: any[];
  variants: any[];

}
