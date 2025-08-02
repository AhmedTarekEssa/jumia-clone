import { AddProduct } from './../../../../seller/components/add-product/add-product';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../../core/services/Product-Service/product';
import { ProductDetails, ProductUi } from '../../../../products/product-models';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../../../../core/services/Categories/category';
import { environment } from '../../../../../../environments/environment.development';

interface Product {
  productId: number;
  name: string;
  basePrice: number;
  discountPercentage: number;
  imageUrl: any;
  discount?: number;
  approvalStatus: string;
  isAvailable: boolean;
  stockQuantity: number;
  variants: {
    variantId: number;
    color: string;
    size: string;
    price: number;
    stock: number;
    status: 'Active' | 'Inactive';
  }[];
}

interface ProductVariant {
  // Define based on your ProductVariantDto
  variantId: number;
  color: string;
  size: string;
  price: number;
  stock: number;
  status: 'Active' | 'Inactive';
}

interface Category {
  id: number;
  name: string;
}


// interface ProductAttribute {
//   id: number;
//   name: string;
//   values: string[];
// }


@Component({
  standalone: true ,
  selector: 'app-admin-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProducts implements OnInit , OnDestroy {
  private destroyed = new Subject<void>();
  private categoryService = inject( CategoryService);
  private cdr = inject(ChangeDetectorRef);

  searchTerm = '';
  categoryFilter = '';
  statusFilter = '';
  isAvailableFilter : boolean | null = null;
  baseImageUrl=environment.ImageUrlBase;
  products: Product[] = [];
  isLoading = true;
  error = '';

  categories: Category[] = [];
    // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 3;
   

  constructor(private productService : ProductService){}

  ngOnInit(): void {
      console.log('Component initialized'); // Debug log

    this.loadProducts();
    this.loadCategories();
    
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

 
  loadProducts(): void {
    this.isLoading = true;
    this.error = '';
    
    this.productService.getAllUi().pipe(
      takeUntil(this.destroyed)
    ).subscribe({
      next: (apiProducts) => {
              console.log('API Products:', apiProducts); // Debug log

        this.products = this.mapApiProductsToUiModel(apiProducts);
              console.log('Mapped Products:', this.products); // Debug log

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Error loading products:', err);
      }
    });
  }

  // Add these methods to the component class
acceptProduct(product: Product): void {
  if (confirm('Are you sure you want to approve this product?')) {
    this.isLoading = true;
    
    this.productService.udpateProductStatus(product.productId,'approved').pipe(
      takeUntil(this.destroyed)
    ).subscribe({
      next: (response) => {
        // Update local product status
        this.products = this.products.map(p => 
          p.productId === product.productId ? 
          { ...p, approvalStatus: 'approved', isAvailable: true } : 
          p
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to approve product';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Approve error:', err);
      }
    });
  }
}

declineProduct(product: Product): void {
  if (confirm('Are you sure you want to decline this product?')) {
    this.isLoading = true;
    
    this.productService.dactivateProduct(product.productId).pipe(
      takeUntil(this.destroyed))
    .subscribe({
      next: (response) => {
        // Update local product status
        this.products = this.products.map(p => 
          p.productId === product.productId ? 
          { ...p, approvalStatus: 'rejected', isAvailable: false } : 
          p
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to decline product';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Decline error:', err);
      }
    });
  }
}


  loadCategories():void {
    this.categoryService.getAllCategories().pipe(
      takeUntil(this.destroyed)
    ).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:',err);
      }
    });
  }

 
  private mapApiProductsToUiModel(apiProducts: ProductUi[]): Product[] {
    if (!apiProducts) return [];

    return apiProducts.map(apiProduct => ({
    productId: apiProduct.productId,
    name: apiProduct.name,
    basePrice: apiProduct.basePrice,
    discountPercentage: apiProduct.discountPercentage,
    imageUrl: apiProduct.imageUrl,
    discount: apiProduct.discount,
    approvalStatus: apiProduct.approvalStatus,
    isAvailable: apiProduct.isAvailable,
    stockQuantity: apiProduct.stockQuantity,
    variants: apiProduct.variants?.map(variant => ({
      variantId: variant.variantId,
      color: variant.variantName,
      size: variant.sku,
      price: variant.price,
      stock: variant.stockQuantity,
      status: variant.stockQuantity > 0 ? 'Active' : 'Inactive'
    })) || []
    }));
  }


  get filteredProducts(): Product[] {
  // console.log('Current statusFilter:', this.statusFilter);
  // console.log('Sample product statuses:', this.products.slice(0, 3).map(p => p.approvalStatus));
    return this.products.filter(product => {

      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || 
        product.approvalStatus.toLowerCase() === this.statusFilter.toLowerCase();
      // const matchesAvailability = this.isAvailableFilter === null || product.isAvailable === (this.isAvailableFilter === 'true');
      // console.log(`Product: ${product.name}, Status: ${product.approvalStatus}, Available: ${product.isAvailable} ,matchesStatus: ${matchesStatus}, matchesAvailability: ${matchesAvailability}`);
      console.log("isAvailableFilter: " , this.isAvailableFilter);
      return matchesSearch && matchesStatus ;
    });
  }

    // Pagination methods
  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts?.slice(startIndex, endIndex);
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
    const maxVisiblePages = 5; // Show maximum 5 page numbers
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


 handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  // img.style.display = 'none'; // Hide the broken image
    img.style.opacity = '0';
  // OR
  img.parentElement!.classList.add('image-error'); // Add CSS class to parent
}


// DELETE PRODUCT
  deleteProduct(product: Product): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.isLoading = true;
      
      // Call the deactivate endpoint (assuming this is your delete functionality)
      this.productService.dactivateProduct(product.productId).pipe(
        takeUntil(this.destroyed)
      ).subscribe({
        next: () => {
          // Remove from local array
          this.products = this.products.map(p => p.productId === product.productId ? 
            {...p, approvalStatus: 'rejected' , isAvailable: false} :
            p
          );
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Failed to delete product';
          this.isLoading = false;
          this.cdr.detectChanges();
          console.error('Delete error:', err);
        }
      });
    }
  }

  // ACTIVATE PRODUCT
  activateProduct(productId: number): void {
    this.isLoading = true;
    this.productService.activateProduct(productId).pipe(
      takeUntil(this.destroyed)
    ).subscribe({
      next: () => {
        // Update local status
        this.products = this.products.map(p => {
          if (p.productId === productId) {
            p.variants.forEach(v => v.status = 'Active');
          }
          return p;
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to activate product';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


  private handleLoadError(error: any): void {
    this.isLoading = false;
    this.error = 'Failed to load products. Please try again later.';
    this.cdr.detectChanges();
    console.error('Error loading products:', error);
  }
  






}
