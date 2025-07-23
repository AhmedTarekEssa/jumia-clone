export interface IReview {
    ratingId: number;
    customerId: number;
    customerName: string;
    productId: number;
    stars: number;
    comment: string;
    createdAt: string;
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    
}
