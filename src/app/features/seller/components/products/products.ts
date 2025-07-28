import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { ProductDetails, ProductUi } from '../../../products/product-models';
import { environment } from '../../../../../environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule,],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  products: ProductUi[] = [];
  filteredProducts: ProductUi[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';
  selectedStatus: string = 'all';
  userInfoCookie!: string | null;
  baseImageUrl = environment.ImageUrlBase;

  approved!: ProductUi[];
  rejected!: ProductUi[];
  pending!: ProductUi[];

  currentPage: number = 1;
  itemsPerPage: number = 3;

  private productService = inject(ProductService);

  constructor(private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userInfoCookie = this.getCookie('UserInfo');

    if (this.userInfoCookie) {
      const userInfo = JSON.parse(this.userInfoCookie);
      const userTypeId = userInfo.UserTypeId;
      console.log('UserTypeId:', userTypeId);

      this.productService.getBySellerIdUi(userTypeId, "Seller").subscribe({
        next: (data) => {
          console.log(data);
          this.products = data;
          this.filteredProducts = [...this.products];
          this.approved = this.products.filter(p => p.approvalStatus.toLowerCase() === 'approved');
          this.rejected = this.products.filter(p => p.approvalStatus.toLowerCase() === 'rejected');
          this.pending = this.products.filter(p => p.approvalStatus.toLowerCase() === 'pending');
          this.currentPage = 1;
          this.cdr.detectChanges();
        }
      });
    }
  }

  get paginatedProducts(): ProductUi[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = 1;
    let endPage = this.totalPages;

    if (this.totalPages > maxVisiblePages) {
      const half = Math.floor(maxVisiblePages / 2);
      startPage = Math.max(1, this.currentPage - half);
      endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  filterProducts(): void {
    let filtered = [...this.products];

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(product => product.approvalStatus.toLocaleLowerCase() === this.selectedStatus.toLocaleLowerCase());
    }

    this.filteredProducts = filtered;
    this.currentPage = 1;
  }

  editProduct(productId: number): void {
    this.router.navigate(['/seller/product-edit', productId]);
  }

  activateproduct(productId: number): void {
    this.productService.activateProduct(productId).subscribe({
      next: () => {
    const product = this.products.find(p => p.productId === productId);
        if (product) {
          product.isAvailable = true;
          console.log('Product activated:', product);
          this.cdr.detectChanges();
          this.filterProducts();

          Swal.fire(
            'Activated!',
            'The product has been activated.',
            'success'
          );
        }
      },
      error: () => {
        Swal.fire(
          'Error!',
          'Failed to activate the product.',
          'error'
        );
      }});
  }

  deleteProduct(productId: number): void {
  Swal.fire({
    title: 'Are you sure?',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.productService.dactivateProduct(productId).subscribe({
        next: () => {
          const product = this.products.find(p => p.productId == productId);
          product!.isAvailable = false;
          console.log('Product deleted:', product);
          this.cdr.detectChanges();
          this.filterProducts();

          Swal.fire(
            'Deleted!',
            'The product has been deleted.',
            'success'
          );
        },
        error: () => {
          Swal.fire(
            'Error!',
            'Failed to delete the product.',
            'error'
          );
        }
      });
    }
  });
}

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'status-out-of-stock',
      'approved': 'status-active',
      'rejected': 'status-inactive',
    };
    return statusClasses[status] || '';
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/seller/add-product']);
  }

  getUniqueCategories(): string[] {
    return ["hell"];
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

  searchProducts() {
    this.selectedStatus = 'all';
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLocaleLowerCase()) ||
      p.basePrice == +(this.searchTerm) ||
      p.productId == +(this.searchTerm)
    );
    this.currentPage = 1;
  }
}
