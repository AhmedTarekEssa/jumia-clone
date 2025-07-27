export interface ISeller {
  sellerId: number;
  userId: string;
  businessName: string;
  businessDescription: string;
  businessLogo: string;
  isVerified: boolean;
  verifiedAt: string | null;
  rating: number;
  imageUrl: string;
  totalProductsSold: number;
  totalAmountSold:number;
}
