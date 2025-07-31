import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { ProductUi } from '../../../products/product-models';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-promotions',
  imports: [CommonModule, FormsModule],
  templateUrl: './promotions.html',
  styleUrl: './promotions.css'
})
export class Promotions implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private productService: ProductService
  ) {}

  discountedProducts: ProductUi[] = [];
  paginatedProducts: ProductUi[] = [];
  currentPage = 1;
  itemsPerPage = 3;
  totalPages = 1;
  showCreateForm = false;
  baseImageUrl = environment.ImageUrlBase;
  userInfoCookie!: string | null;
  userTypeId!: number ;

  ngOnInit(): void {
    this.userInfoCookie = this.getCookie('UserInfo');
    if (this.userInfoCookie) {
      const userInfo = JSON.parse(this.userInfoCookie);
      const userTypeId = userInfo.UserTypeId;
      console.log('UserTypeId:', userTypeId);
    } else {
      console.error('Unable to identify seller');
    }
    this.loadDiscountedProducts();
  }



  loadDiscountedProducts(): void {
    this.userTypeId = this.userInfoCookie ? JSON.parse(this.userInfoCookie).UserTypeId : 1;
    this.productService.getBySellerIdUi(this.userTypeId,'seller').subscribe({
      next: (products) => {
        this.discountedProducts = products.filter(product =>
          product.discountPercentage
        );
        this.totalPages = Math.ceil(this.discountedProducts.length / this.itemsPerPage);
        this.updatePaginatedProducts();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading discounted products:', error);
      }
    });
  }


  updatePaginatedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedProducts = this.discountedProducts.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }
  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
  get availableProductsCount(): number {
    return this.discountedProducts.filter(p => p.isAvailable).length;
  }

  get outOfStockProductsCount(): number {
    return this.discountedProducts.filter(p => !p.isAvailable).length;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedProducts();
    }
  }
  getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }
}
