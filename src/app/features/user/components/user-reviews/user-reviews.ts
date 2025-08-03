import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { IReview } from '../../../../shared/models/ireview';
import { IReviewService } from '../../../../core/services/ReviewService/ireview-service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { ProductDetails } from '../../../products/product-models';
import { forkJoin } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-reviews',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-reviews.html',
  styleUrl: './user-reviews.css'
})
export class UserReviews implements OnInit {
  pendingReviews: IReview[] = [];
  products: ProductDetails[] = [];
  customerId!: number;
  isLoading = true;
  errorMessage = '';

  constructor(
    private reviewService: IReviewService,
    private productService: ProductService,
    private cookieService: CookieService,
    private cdr: ChangeDetectorRef // ✅ Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkUserLogin();
    this.loadData();
  }

  checkUserLogin() {
    const userInfoCookie = this.cookieService.get('UserInfo');
    if (userInfoCookie) {
      try {
        const decodedCookie = decodeURIComponent(userInfoCookie);
        const userInfo = JSON.parse(decodedCookie);
        this.customerId = userInfo.UserTypeId || 1;
        this.cdr.detectChanges(); // ✅ Trigger change detection after parsing
      } catch (e) {
        console.error('Error parsing user info cookie', e);
        this.errorMessage = 'Failed to load user information';
        this.cdr.detectChanges(); // ✅ Update UI with error message
      }
    }
  }

  loadData() {
    this.isLoading = true;
    this.cdr.detectChanges(); // ✅ Trigger loading state update

    forkJoin({
      reviews: this.reviewService.GetPendingReviewByCustomer(this.customerId),
      products: this.productService.getAllWithDetails()
    }).subscribe({
      next: ({ reviews, products }) => {
        this.pendingReviews = reviews;
        this.products = products;
        this.isLoading = false;
        this.cdr.detectChanges(); // ✅ Reflect data and loading state in UI
      },
      error: (err) => {
        console.error('Failed to load data:', err);
        this.errorMessage = 'Failed to load pending reviews';
        this.isLoading = false;
        this.cdr.detectChanges(); // ✅ Ensure error and loading flags update UI
      }
    });
  }

  getProductId(productName: string): number | null {
    const product = this.products.find(p => p.name === productName);
    return product ? product.productId : null;
  }
}
