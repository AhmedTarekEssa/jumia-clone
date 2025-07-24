import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { ProductUi } from '../../../products/product-models';
import { CommonModule } from '@angular/common';
import { DiscountPricePipe } from "../../../../shared/pipes/discount-price-pipe";
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';
import { CategoryService } from '../../../../core/services/Categories/category';
import { Category } from '../../../../shared/models/category-';

@Component({
  selector: 'app-category-showcase',
  imports: [CommonModule, DiscountPricePipe],
  templateUrl: './category-showcase.html',
  styleUrl: './category-showcase.css'
})
export class CategoryShowcase implements OnInit {
  @Input() categoryId!: number;

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  base = environment.ImageUrlBase;
  products: ProductUi[] = [];
  category: Category | null = null;

  ngOnInit(): void {
    if (this.categoryId ) {
      console.log(this.categoryId);
      this.loadCategoryAndProducts();
    }
  }

  loadCategoryAndProducts() {
    // Load category details
    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.category = category;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading category', err)
    });

    // Load products for this category
    this.productService.productsByFilters({ categoryIds: [this.categoryId] }, 1, 10).subscribe({
      next: (data) => {
        this.products = data.items;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading products', err)
    });
  }

  goToProductDetails(productId: number) {
    this.router.navigate(['/Products', productId]);
  }

  scrollLeft(container: HTMLElement) {
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(container: HTMLElement) {
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }



// private productService = inject(ProductService)
// private cdr = inject(ChangeDetectorRef)
// private router = inject(Router)
// base = environment.ImageUrlBase;
// products!:ProductUi[];


// ngOnInit(): void {
//   this.productService.productsByFilters({ categoryIds: [15] },1,10).subscribe({
//     next: (data) => {
//       this.products = data.items;
//       console.log(this.products)
//       this.cdr.detectChanges();
//     }
// })
// }

// goToProductDetails(productId: number) {
//     this.router.navigate(['/product', productId]);
//   }
}
