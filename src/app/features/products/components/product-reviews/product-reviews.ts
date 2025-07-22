import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IReview,  } from '../../../../shared/models/ireview';
import { IReviewService } from '../../../../core/services/ReviewService/ireview-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IReviewCreate } from '../../../../shared/models/ireview-create';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.html',
  styleUrls: ['./product-reviews.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ProductReviews implements OnInit {

  reviews: IReview[] = [];
  averageRating = 0;

  canAddReview = false;
  showReviewForm = false;
  

  customerId = 1; // Simulate for now
  productId = 4; // Make dynamic later

  newReview: IReviewCreate = {
    customerID: this.customerId,
    productID: this.productId,
    stars: 5,
    comment: ''
  };

  constructor(
    private reviewService: IReviewService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  Print() {
    console.log('Print');
  }

  loadReviews() {
    this.reviewService.getReviewByProductId(this.productId).subscribe({
      next: (res) => {
        this.reviews = res;
        console.log('ReviewLoad',this.reviews)
        this.calculateAverage();
        this.checkCustomerEligibility();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load reviews:', err);
      }
    });
  }

  calculateAverage() {
    const total = this.reviews.reduce((sum, r) => sum + r.stars, 0);
    this.averageRating = this.reviews.length ? total / this.reviews.length : 0;
  }

  getStars(count: number): number[] {
    return Array(Math.round(count)).fill(0);
  }

checkCustomerEligibility() {
  this.reviewService.hasCustomerPurchasedProduct(this.customerId, this.productId).subscribe({
    next: (hasPurchased) => {
      this.canAddReview = hasPurchased;
      this.cdr.detectChanges(); // in case async update affects view
    },
    error: (err) => {
      console.error('Error checking purchase status:', err);
      this.canAddReview = false;
    }
  });
}
showAllReviews = false;

get visibleReviews(): IReview[] {
  const sorted = [...this.reviews].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return this.showAllReviews ? sorted : sorted.slice(0, 3);
}




  openReviewForm() {
    this.showReviewForm = true;
  }

  submitReview() {
    this.reviewService.addRating(this.newReview).subscribe({
      next: () => {
        this.showReviewForm = false;
        this.newReview = { customerID: this.customerId, productID: this.productId, stars: 5, comment: '' };
        this.loadReviews(); // refresh
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to submit review.');
      }
    });
  }
}
