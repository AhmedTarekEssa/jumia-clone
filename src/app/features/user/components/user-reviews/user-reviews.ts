import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { IReview } from '../../../../shared/models/ireview';
import { IReviewService } from '../../../../core/services/ReviewService/ireview-service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { ProductDetails } from '../../../products/product-models';
import { forkJoin } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-reviews',
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
    private cookieService: CookieService
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
      } catch (e) {
        console.error('Error parsing user info cookie', e);
        this.errorMessage = 'Failed to load user information';
      }
    }
  }

  loadData() {
    this.isLoading = true;

    // Fetch both pending reviews and products simultaneously
    forkJoin({
      reviews: this.reviewService.GetPendingReviewByCustomer(this.customerId),
      products: this.productService.getAllWithDetails()
    }).subscribe({
      next: ({ reviews, products }) => {
        this.pendingReviews = reviews;
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load data:', err);
        this.errorMessage = 'Failed to load pending reviews';
        this.isLoading = false;
      }
    });
  }

  getProductId(productName: string): number | null {
    const product = this.products.find(p => p.name === productName);
    return product ? product.productId : null;
  }
}
