import { ChangeDetectorRef, Component } from '@angular/core';
import { IReview } from '../../../../shared/models/ireview';
import { IReviewCreate } from '../../../../shared/models/ireview-create';
import { IReviewService } from '../../../../core/services/ReviewService/ireview-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-product-review-show-all',
  imports: [FormsModule,CommonModule],
  templateUrl: './product-review-show-all.html',
  styleUrl: './product-review-show-all.css'
})
export class ProductReviewShowAll {
  reviews: IReview[] = [];
  averageRating = 0;

  canAddReview = false;
  showReviewForm = false;
  

  customerId!: number; // Simulate for now
  productId!: number; // Make dynamic later

  newReview: IReviewCreate = {
    customerID: this.customerId,
    productID: this.productId,
    stars: 5,
    comment: ''
  };

  constructor(
    private reviewService: IReviewService,
    private cdr: ChangeDetectorRef,
    private routes:ActivatedRoute,
    private cookieService : CookieService
  ) {}
  ngOnInit(): void {
  this.routes.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.productId = +id;
      this.newReview.productID = this.productId;
      this.checkUserLogin();
      this.newReview.customerID = this.customerId;
      this.loadReviews();
    }
    this.cdr.detectChanges();
  });
  }

      checkUserLogin() {
    const userInfoCookie = this.cookieService.get('UserInfo');
    if (userInfoCookie) {
      try {
        // Decode the URL encoded cookie
        const decodedCookie = decodeURIComponent(userInfoCookie);
        const userInfo = JSON.parse(decodedCookie);
        this.customerId = userInfo.UserTypeId || 1; // Fallback to 1 if not set

      } catch (e) {
        console.error('Error parsing user info cookie', e);
      }
    }
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


  pageSize = 5;
currentPage = 1;

get totalPages(): number {
  return Math.ceil(this.reviews.length / this.pageSize);
}

get paginatedReviews(): IReview[] {
  const sorted = [...this.reviews].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const startIndex = (this.currentPage - 1) * this.pageSize;
  return sorted.slice(startIndex, startIndex + this.pageSize);
}

goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
  }
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
