export  interface ISeller {
  sellerId: number;
  sellerName: string;
  email: string;
  userId: string;
  businessName: string;
  imageUrl: string;
  businessDescription: string;
  businessLogo: string;
  isVerified: "Authorized" | "Blocked"| "Pending";
  verifiedAt: string | null;
  rating: number;
  totalProductsSold: number;
  totalAmountSold: number;
}
