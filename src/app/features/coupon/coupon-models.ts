export interface CreateCouponDto {
   code: string;
  description: string;
  discountAmount: number;
  minimumPurchase: number;
  discountType: 'Percentage' | 'Fixed';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit?: number;
}

export interface CouponDto {
  couponId: number;
  code: string;
  description: string;
  discountAmount: number;
  minimumPurchase: number;
  discountType: 'Percentage' | 'Fixed';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
}