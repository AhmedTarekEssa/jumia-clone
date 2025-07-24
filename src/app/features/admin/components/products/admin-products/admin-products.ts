import { AddProduct } from './../../../../seller/components/add-product/add-product';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../../core/services/Product-Service/product';
import { ProductDetails } from '../../../../products/product-models';
import { Subject, takeUntil } from 'rxjs';

interface Product {
   productId: number;
  name: string;
  basePrice: number;
  discountPercentage: string;
  imageUrl: string;
  variants: ProductVariant[];
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


@Component({
  standalone: true ,
  selector: 'app-admin-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProducts implements OnInit , OnDestroy {
  private destroyed = new Subject<void>();

    showAddForm = false;
  searchTerm = '';
  categoryFilter = '';
  statusFilter = '';

  products: Product[] = [];
  isLoading = true;
  error = '';

  constructor(private productService: ProductService , private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
      console.log('Component initialized'); // Debug log

    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

 
  loadProducts(): void {
    this.isLoading = true;
    this.error = '';
    
    this.productService.getAllWithDetails().pipe(
      takeUntil(this.destroyed)
    ).subscribe({
      next: (apiProducts) => {
        this.products = this.mapApiProductsToUiModel(apiProducts);
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


  private mapApiProductsToUiModel(apiProducts: ProductDetails[]): Product[] {
    if (!apiProducts) return [];

    return apiProducts.map(apiProduct => ({
      productId: apiProduct.productId,
      name: apiProduct.name,
      basePrice: apiProduct.basePrice,
      discountPercentage: apiProduct.discountPercentage,
      imageUrl: apiProduct.mainImageUrl,
      variants: apiProduct.variants.map(variant => ({
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
    return this.products.filter(product => {
      return product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

 handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none'; // Hide the broken image
  // OR
  img.parentElement!.classList.add('no-image'); // Add CSS class to parent
}

addProduct():void{
  

}

  // newProduct = {
  //   name: '',
  //   category: '',
  //   price: 0,
  //   stock: 0,
  //   seller: '',
  //   status: 'Active' as 'Active' | 'Inactive'
  // };

  // products: Product[] = [
  //   { id: 1, name: 'iPhone 14 Pro', category: 'Electronics', price: 999, stock: 15, status: 'Active', seller: 'Apple Store', image: 'https://via.placeholder.com/200x200?text=iPhone' },
  //   { id: 2, name: 'Samsung Galaxy S23', category: 'Electronics', price: 799, stock: 20, status: 'Active', seller: 'Samsung Official', image: 'https://via.placeholder.com/200x200?text=Samsung' },
  //   { id: 3, name: 'Nike Air Max', category: 'Fashion', price: 129, stock: 50, status: 'Active', seller: 'Nike Store', image: 'https://via.placeholder.com/200x200?text=Nike' },
  //   { id: 4, name: 'Coffee Maker', category: 'Home', price: 89, stock: 0, status: 'Inactive', seller: 'Home Essentials', image: 'https://via.placeholder.com/200x200?text=Coffee' }
  // ];

  // get filteredProducts(): Product[] {
  //   return this.products.filter(product => {
  //     const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
  //     const matchesCategory = !this.categoryFilter || product.category === this.categoryFilter;
  //     const matchesStatus = !this.statusFilter || product.status === this.statusFilter;
  //     return matchesSearch && matchesCategory && matchesStatus;
  //   });
  // }

  // addProduct(): void {
  //   if (this.newProduct.name && this.newProduct.category && this.newProduct.price > 0) {
  //     const product: Product = {
  //       id: this.products.length + 1,
  //       ...this.newProduct,
  //       image: 'https://via.placeholder.com/200x200?text=New'
  //     };
  //     this.products.push(product);
  //     this.newProduct = { name: '', category: '', price: 0, stock: 0, seller: '', status: 'Active' };
  //     this.showAddForm = false;
  //   }
  // }


}
