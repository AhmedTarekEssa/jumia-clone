import { CookieService } from 'ngx-cookie-service';
import { routes } from './../../../../app.routes';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IReview,  } from '../../../../shared/models/ireview';
import { IReviewService } from '../../../../core/services/ReviewService/ireview-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IReviewCreate } from '../../../../shared/models/ireview-create';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';

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
    private cookieService : CookieService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.routes.params.subscribe(params => {
      this.productId = +params['id']; // Get product ID from route
      // this.customerId = +params['customerId'] || 1; // Simulate customer ID for now
      this.checkUserLogin(); 
      this.newReview.customerID = this.customerId; // Ensure customerId is set
      this.newReview.productID = this.productId;
      // Ensure customerId is set
    });
    this.loadReviews();
  }

  Print() {
    this.route.navigate([`/Products/${this.productId}/reviews`]);
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
