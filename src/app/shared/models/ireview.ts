export interface IReview {
    ratingId: number;
    customerId: number;
    customerName: string;
    productName: string;
    stars: number;
    comment: string;
    createdAt: string;
    isVerifiedPurchase: boolean;
    isAccepted:'Approved' | 'Pending' | 'Rejected' ;
    helpfulCount: number;
    
}
